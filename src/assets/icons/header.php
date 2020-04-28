<?php defined('BASE_PATH') OR exit('No direct script access allowed');
$uri = $_SERVER['REQUEST_URI'];
$configArray = parse_ini_file(BASE_PATH . DS . "config.ini", true);
$config = $configArray['Config'];
?>

<!DOCTYPE html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">

    <title><?php echo framework\infrastructure\DefaultVariables::$PageTitle ?></title>

    <?php include_once(BASE_PATH . DS . "framework/infrastructure/DefaultJavaScriptVariables.php") ?>

    <?php require_once("headerStaticFiles.php") ?>

    <?php require_once(BASE_PATH . DS . $config['ThemePath'] . "pluginSpecStaticFilesHeader.php") ?>

    <?php include_once("headerScripts.php") ?>

    <?php require_once(BASE_PATH . DS . $config['ThemePath'] . "pluginSpecStaticFilesFooter.php") ?>
</head>
<body style="overflow-x: hidden">

<div class="header_container">
<?php include_once(BASE_PATH . DS . "app/Modules/FrontEnd/Views/parts/top-header.php") ?>
<?php include_once(BASE_PATH . DS . "framework/view/menu.php") ?>
</div>
    
<div class="row" style="margin: inherit">
    <div class="menucon child-menu" id="inner-child-menu">

        <div class="container">
            <ul class="child-menu-list">
            </ul>


        </div>

    </div>
</div>

    

    <div class="container bg-color-white height-50">
        <div id="MessageTypeDiv" class="modal-dialog modal-alerts modal-alert-succes"
             style="display: ; animation-name: moveDown; animation-duration: 1s; animation-fill-mode: forwards;">
            <div class="modal-content">
                <div class="modal-body clearfix">
                    <div class="alerts-icon"></div>
                    <div class="alerts-text">
                        <h3 id="MessageType">Success</h3>

                        <p id="Message">Priority Successfully Updated</p>
                    </div>
                </div>
            </div>
        </div>
        <?php include_once("headerMenu.php") ?>

        <div class="wrapper row-offcanvas row-offcanvas-left">
            <div class="pageTitle">
                <div class="col-sm-12" style="left:11px;">
                    <h3 class="page-header" style="margin: 37px -12px 17px;"><?php echo $PageTitle; ?></h3>
                    <ol class="breadcrumb" id="menuBreadCrumb">
                        <?php
                        if (is_array($Breadcrumb)) {
                            foreach ($Breadcrumb as $key => $value) {
                                if (is_numeric($key)) {
                                    echo '<li class="active">' . $value . '</li>';
                                } else {
                                    echo '<li><a href="' . $value . '">' . $key . '</a></li>';
                                }
                            }
                        }
                        ?>
                    </ol>
                </div>

            </div>
            <!-- Main content -->
            <div class="container">
                <div class="row">

                    <div class="col-md-12">
                        <section class="content">
                            






