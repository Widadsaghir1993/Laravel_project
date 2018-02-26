<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\PostRequest;
use App\Post;
use Illuminate\Support\Facades\DB;

class PostController extends Controller
{
    /**
     * Map Url geo location
     * @var string
     */
    protected $mapUrl = "http://maps.googleapis.com/maps/api/geocode/json?latlng=";
    
    /**
     * Geo Api
     * @var string
     */
    protected $ipUsrl = 'http://freegeoip.net';

    /**
     * Url for curl
     * @var mixed
     */
    protected $url;

    /**
     * @return Index
     */
    public function index(Request $request)
    {
        return view('front.index'); 
    }

    /**
     * @return [type]
     */
    public function getPosts(Request $request)
    {
        $circle_radius = 3959;
        $user_lat = $request->get('lat');
        $user_lon = $request->get('lon');

        if ($request->has('ip')) {
            $data = $this->getLatLongFromIp($request);
            $user_lat = $data->latitude;
            $user_lon = $data->longitude;
        }


        //Join statement responsible for retieving dogs addresses based on latitude and longitude in address table.
        $data =  DB::table('posts')
            ->select('id', 'place', 'desc', 'created_at', 'image', 'comment_count',
                DB::raw('3959 * acos(cos(radians(' . $user_lat . '))
                        * cos(radians(lat))
                        * cos(radians(lon)-radians(' . $user_lon . '))
                        + sin(radians(' . $user_lat . '))
                        * sin(radians(lat))) as distance'))
            ->having('distance', '<=', 7)
            ->orderBy('created_at', 'DESC')
            ->get();

        if(!empty($data)) {
            foreach ($data as $key => $value) {
                $data[$key] = $value;
                $data[$key]->place = $this->makePlace($value->place);
                $data[$key]->time_formated = \Carbon\Carbon::createFromTimeStamp(strtotime($value->created_at))->diffForHumans();
                $data[$key]->distance = round($value->distance, 1);
                $data[$key]->url = base64_encode($value->id);
            }
        }

        return $data;
    }

    /**
     * [makePlace description]
     * @return String
     */
    protected function makePlace($data)
    {
        $array = explode(',', $data);

        if(count($array) > 4) {
            return $array[count($array) - 2] .', '. $array[count($array) - 1];    
        }

        return $array[count($array) - 3] .$array[count($array) - 2] .', '. $array[count($array) - 1];
    }

    /**
     * @param  PostRequest
     * @return mixed
     */
    public function store(PostRequest $request)
    {
        $data = $request->all();
        $post = new Post();

        //Set Geo Url
        $this->setGeoUrl($request);
        
        if(!$this->url) {
            $data = $this->getLatLongFromIp($request);
            $post->place =
             $data->city . ', ' . $data->region_name .', '. $data->zip_code . ', ' . $data->country_name;
            $post->desc  = $request->get('desc');
            $post->lat  = $data->latitude;
            $post->lon  = $data->longitude;
            $post->save();
        }

        //Save Geo data
        if($this->url && $data['place'] = $this->getGeoData()) {
            $post->place = $data['place'];
            $post->desc  = $data['desc'];
            $post->lat  = $data['lat'];
            $post->lon  = $data['long'];
            $post->save();
        }

        if (!empty($request->file('image'))) {
            $imageName = $post->id . '.' . 
            $request->file('image')->getClientOriginalExtension();

            $request->file('image')->move(
                base_path() . '/images/', $imageName
            );

            $post->image = 'images/' .  $imageName;
            $post->save();
        }
        
        $post->time_formated = \Carbon\Carbon::createFromTimeStamp(strtotime($post->created_at))->diffForHumans();
        $post->distance = 0;
        $post->place = $this->makePlace($post->place);
        $post->url = base64_encode($post->id);
        $post->comment_count = 0;

        return $post; 
    }

    /**
     * getLatLongFromIp Get Geo Data from Ip
     * 
     * @return mixed
     */
    protected function getLatLongFromIp($request)
    {
        $ipAddresses = $request->ips();
        $data        = file_get_contents($this->ipUsrl . '/json/' . '27.7.80.123');
        
        return json_decode($data);
    }

    /**
     * @param  Reuest
     * @return mixed
     */
    protected function setGeoUrl($request)
    {
        if ($request->has('lat') && $request->has('lat')) {
            $lat      = $request->get('lat');
            $long     = $request->get('long');
            
            $this->url = $this->mapUrl . $lat . ',' . $long . '&sensor=false';
        }
    }

    /**
     * @return Get Geo data
     */
    protected function getGeoData()
    {
        try{
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $this->url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_PROXYPORT, 3128);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
            $response = curl_exec($ch);
            curl_close($ch);
            
            $response_a = json_decode($response);

            return $response_a->results[0]->formatted_address;  
        } catch(Exception $e) {
            //Handle the code if not got the lat long
        }
    }

    /**
     * [show description]
     * @param  [type] $id [description]
     * @return [type]     [description]
     */
    public function viewPost($id)
    {
        $post     = (new Post)->find(base64_decode($id));
        $comments = [];

        return view('front.post')->with(
            [
                'post' => $post,
                'comments' => $comments
            ]
        );
    }
}
