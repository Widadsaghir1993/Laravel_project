<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\CommentRequest;
use App\Comment;
use App\Post;

class CommentController extends Controller
{
	/**
	 * store comment
	 * 
	 * @return comment
	 */
    public function store(CommentRequest $request)
    {
    	$comment = new Comment();
    	$comment->fill($request->all())->save();
    	$post = (new Post())->find($request->get('post_id'));
    	$post->comment_count = $post->comment_count + 1;
    	$post->save();
    	 
    	$comment->time_formated = \Carbon\Carbon::createFromTimeStamp(strtotime($comment->created_at))->diffForHumans();

    	return $comment;
    }

    /**
     * [index List Comment
     * @return mixed
     */
    public function index($id)
    {
    	$comments =  (new Comment())->where('post_id', $id)->orderBy('id', 'DESC')->get();
    	$data = [];

    	foreach ($comments as $key => $value) {
    		$data[$key] = $value;
    		$data[$key]->time_formated = \Carbon\Carbon::createFromTimeStamp(strtotime($value->created_at))->diffForHumans();
    	}

    	return $data;
    }
}
