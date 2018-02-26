<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/get-post', 'PostController@getPosts');
Route::post('/post', 'PostController@store');
Route::post('/comment', 'CommentController@store');
Route::get('/comment/{id}', 'CommentController@index');
Route::get('/post/{id}', 'PostController@viewPost');
Route::get('/', 'PostController@index');
