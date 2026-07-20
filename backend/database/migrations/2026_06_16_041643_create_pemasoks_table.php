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
    Schema::create('pemasoks', function (Blueprint $table) {
        $table->id();

        $table->string('supplier_name');
        $table->string('email')->nullable();
        $table->string('phone')->nullable();

        $table->json('waste_type')->nullable();

        $table->integer('total_pickup')->default(0);

        $table->string('city')->nullable();

        $table->enum('status', [
            'Active',
            'Pending',
            'Inactive'
        ])->default('Active');

        $table->date('join_date')->nullable();
        $table->date('last_pickup')->nullable();

        $table->string('payment_method')->nullable();

        $table->text('address')->nullable();

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pemasoks');
    }
};
