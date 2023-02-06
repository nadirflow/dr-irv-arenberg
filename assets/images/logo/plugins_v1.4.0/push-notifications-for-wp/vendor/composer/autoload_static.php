<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit833c2b6d4bbadbe2bc683da7416dff01
{
    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
        'WP_Async_Request' => __DIR__ . '/..' . '/a5hleyrich/wp-background-processing/classes/wp-async-request.php',
        'WP_Background_Process' => __DIR__ . '/..' . '/a5hleyrich/wp-background-processing/classes/wp-background-process.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->classMap = ComposerStaticInit833c2b6d4bbadbe2bc683da7416dff01::$classMap;

        }, null, ClassLoader::class);
    }
}