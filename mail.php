<?php
/**
 * Nellai Nexus - Brevo Email Notification Dispatcher
 * Reads API key and settings from mail_config.json
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Load JSON config
$configFile = __DIR__ . '/mail_config.json';
$config = [];
if (file_exists($configFile)) {
    $config = json_decode(file_get_contents($configFile), true) ?? [];
}

$apiKey = $config['brevo_api_key'] ?? '';
$adminEmail = $config['admin_notification_email'] ?? 'nellainexus@gmail.com';
$senderEmail = $config['sender_email'] ?? 'nellainexus@gmail.com';
$senderName = $config['sender_name'] ?? 'Nellai Nexus';

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true) ?? $_POST ?? [];

$refId = trim($data['refId'] ?? ('NN-' . date('Ym') . '-' . rand(1000, 9999)));
$name = htmlspecialchars(trim($data['name'] ?? 'Guest Customer'));
$phone = htmlspecialchars(trim($data['phone'] ?? 'N/A'));
$email = htmlspecialchars(trim($data['email'] ?? ''));
$service = htmlspecialchars(trim($data['service'] ?? 'General Event Service'));
$date = htmlspecialchars(trim($data['date'] ?? 'Flexible'));
$venue = htmlspecialchars(trim($data['venue'] ?? 'Tirunelveli'));
$guests = htmlspecialchars(trim($data['guests'] ?? 'N/A'));
$notes = htmlspecialchars(trim($data['notes'] ?? 'None'));

// Log enquiry locally into enquiries.json
$logFile = __DIR__ . '/enquiries.json';
$enquiries = [];
if (file_exists($logFile)) {
    $enquiries = json_decode(file_get_contents($logFile), true) ?? [];
}
array_unshift($enquiries, [
    'ref_id' => $refId,
    'timestamp' => date('Y-m-d H:i:s'),
    'name' => $name,
    'phone' => $phone,
    'service' => $service,
    'date' => $date,
    'venue' => $venue,
    'guests' => $guests,
    'notes' => $notes
]);
@file_put_contents($logFile, json_encode($enquiries, JSON_PRETTY_PRINT));

// Send Transactional Email via Brevo REST API
$brevoResult = ['status' => 0, 'message' => 'Brevo API key missing'];

if (!empty($apiKey)) {
    $htmlBody = "
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;'>
        <div style='background: #16215c; color: #ffffff; padding: 20px; border-bottom: 4px solid #d81b60;'>
            <h2 style='margin: 0; font-size: 22px; letter-spacing: 1px;'>NELLAI NEXUS</h2>
            <p style='margin: 4px 0 0 0; font-size: 13px; color: #f472b6;'>New Event Enquiry Received</p>
        </div>
        <div style='padding: 24px;'>
            <p style='font-size: 14px; color: #334155; margin-top: 0;'>A new customer has submitted an event enquiry on <strong>nellainexus.in</strong>.</p>
            
            <table style='width: 100%; border-collapse: collapse; margin: 18px 0; font-size: 13px;'>
                <tr style='background: #f8fafc; border-bottom: 1px solid #e2e8f0;'>
                    <td style='padding: 10px; font-weight: bold; color: #475569; width: 35%;'>Reference ID:</td>
                    <td style='padding: 10px; color: #d81b60; font-weight: bold; font-family: monospace;'>{$refId}</td>
                </tr>
                <tr style='border-bottom: 1px solid #e2e8f0;'>
                    <td style='padding: 10px; font-weight: bold; color: #475569;'>Customer Name:</td>
                    <td style='padding: 10px; color: #0f172a; font-weight: bold;'>{$name}</td>
                </tr>
                <tr style='background: #f8fafc; border-bottom: 1px solid #e2e8f0;'>
                    <td style='padding: 10px; font-weight: bold; color: #475569;'>Phone Number:</td>
                    <td style='padding: 10px;'><a href='tel:{$phone}' style='color: #2563eb; font-weight: bold; text-decoration: none;'>{$phone}</a></td>
                </tr>
                <tr style='border-bottom: 1px solid #e2e8f0;'>
                    <td style='padding: 10px; font-weight: bold; color: #475569;'>Service Required:</td>
                    <td style='padding: 10px; color: #0f172a; font-weight: bold;'>{$service}</td>
                </tr>
                <tr style='background: #f8fafc; border-bottom: 1px solid #e2e8f0;'>
                    <td style='padding: 10px; font-weight: bold; color: #475569;'>Event Date:</td>
                    <td style='padding: 10px; color: #0f172a;'>{$date}</td>
                </tr>
                <tr style='border-bottom: 1px solid #e2e8f0;'>
                    <td style='padding: 10px; font-weight: bold; color: #475569;'>Venue / City:</td>
                    <td style='padding: 10px; color: #0f172a;'>{$venue}</td>
                </tr>
                <tr style='background: #f8fafc; border-bottom: 1px solid #e2e8f0;'>
                    <td style='padding: 10px; font-weight: bold; color: #475569;'>Guest Count:</td>
                    <td style='padding: 10px; color: #0f172a;'>{$guests}</td>
                </tr>
                <tr>
                    <td style='padding: 10px; font-weight: bold; color: #475569;'>Notes / Message:</td>
                    <td style='padding: 10px; color: #0f172a;'>{$notes}</td>
                </tr>
            </table>

            <div style='margin-top: 20px; text-align: center;'>
                <a href='https://wa.me/91{$phone}' style='background: #059669; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-size: 13px; font-weight: bold; display: inline-block;'>
                    Chat With Customer on WhatsApp
                </a>
            </div>
        </div>
        <div style='background: #f1f5f9; padding: 14px 24px; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;'>
            <strong>Nellai Nexus Command Hub:</strong> 196, SM Plaza, Tiruchendur Road, Samathanapuram, Palayamkottai - 627002. | Hotline: +91 96262 72817
        </div>
    </div>
    ";

    $payload = [
        'sender' => [
            'name' => $senderName,
            'email' => $senderEmail
        ],
        'to' => [
            ['email' => $adminEmail, 'name' => 'Nellai Nexus Admin']
        ],
        'subject' => "New Event Enquiry [{$refId}]: {$service} - {$name}",
        'htmlContent' => $htmlBody
    ];

    $ch = curl_init('https://api.brevo.com/v3/smtp/email');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'api-key: ' . $apiKey,
        'Content-Type: application/json',
        'Accept: application/json'
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 6);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $brevoResult = [
        'http_code' => $httpCode,
        'response' => json_decode($response, true) ?? $response
    ];
}

echo json_encode([
    'status' => 1,
    'message' => 'Enquiry logged successfully',
    'ref_id' => $refId,
    'brevo' => $brevoResult
]);
