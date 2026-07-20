<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('pembelis', function (Blueprint $table) {
        $table->id();

        $table->string('name');
        $table->string('email')->nullable();
        $table->string('phone')->nullable();

        $table->text('address')->nullable();

        $table->enum('status', [
            'Active',
            'Inactive',
            'Blocked'
        ])->default('Active');

        $table->integer('total_orders')->default(0);

        $table->decimal('total_spent', 15, 2)->default(0);

        $table->string('waste_type')->nullable();

        $table->date('join_date')->nullable();

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembelis');
    }
};
