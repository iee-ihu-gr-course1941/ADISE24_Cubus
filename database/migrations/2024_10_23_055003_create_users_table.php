<?php

use App\Enums\AuthenticationType;
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
        Schema::create('user_portraits', function (Blueprint $table) {
            $table->id();
            $table->string('url');
        });

        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedInteger('points')->default(0);

            $table->uuid('private_id');
            $table->uuid('public_id');

            // The following col is nullable to fix a problem with enums and sqlite.
            $table->enum('auth_type', AuthenticationType::values())->nullable(true);
            $table->string('auth_identifier');

            $table->string('name', length: 80)->default('');
            $table->foreignId('icon')->nullable()->constrained('user_portraits');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('user_portraits');
    }
};
