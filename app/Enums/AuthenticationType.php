<?php

namespace App\Enums;

enum AuthenticationType: string {
    case Apps = 'apps';
    case Mock = 'mock';

    static function values(): array {
        return array_column(AuthenticationType::cases(), 'value');
    }
}
