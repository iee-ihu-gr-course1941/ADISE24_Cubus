<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        DB::table('user_portraits')->insert([
            ['url' => '/portraits/black-elegance.jpg'],
            ['url' => '/portraits/black-mlady.jpg'],
            ['url' => '/portraits/white-cowboy.jpg'],
            ['url' => '/portraits/white-wizard.jpg'],
            ['url' => '/portraits/yellow-elegance.jpg'],
            ['url' => '/portraits/yellow-mlady.jpg'],
        ]);
    }
}
