<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pembeli extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'address',
        'status',
        'total_orders',
        'total_spent',
        'waste_type',
        'join_date'
    ];

    public function user()
{
    return $this->belongsTo(User::class);
}
}
