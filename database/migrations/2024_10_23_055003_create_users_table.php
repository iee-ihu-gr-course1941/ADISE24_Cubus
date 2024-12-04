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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->uuid('private_id');
            $table->uuid('public_id');

            // The following col is nullable to fix a problem with enums and sqlite.
            $table->enum('auth_type', AuthenticationType::values())->nullable(true);
            $table->string('auth_identifier');

            $table->string('name', length: 80)->nullable(true);
            $table->string('icon')->nullable(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
