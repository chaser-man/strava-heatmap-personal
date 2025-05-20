// Strava API configuration
const stravaConfig = {
    clientId: '160770', // Your Strava Client ID
    clientSecret: '99a4a611ab72ab32e1c739e82bca98036ce4de1f', // Your Strava Client Secret
    redirectUri: window.location.origin,
    scope: 'read,activity:read_all',
    authUrl: 'https://www.strava.com/oauth/authorize',
    tokenUrl: 'https://www.strava.com/oauth/token'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're returning from Strava auth
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');

    if (authCode) {
        // Exchange auth code for token
        exchangeToken(authCode);
    } else if (localStorage.getItem('strava_token')) {
        // We have a token, load activities
        loadActivities();
    } else {
        // Show demo data by default
        demo();
    }
});

function authenticateStrava() {
    if (!stravaConfig.clientId) {
        console.error('Strava client ID not configured');
        return;
    }

    const authUrl = `${stravaConfig.authUrl}?client_id=${stravaConfig.clientId}&response_type=code&redirect_uri=${stravaConfig.redirectUri}&scope=${stravaConfig.scope}&approval_prompt=force`;
    window.location.href = authUrl;
}

function exchangeToken(code) {
    const data = {
        client_id: stravaConfig.clientId,
        client_secret: stravaConfig.clientSecret,
        code: code,
        grant_type: 'authorization_code'
    };

    fetch('php/oauth.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data)
    })
    .then(response => response.json())
    .then(data => {
        localStorage.setItem('strava_token', data.access_token);
        loadActivities();
    })
    .catch(error => {
        console.error('Error:', error);
        demo(); // Fall back to demo mode
    });
}

function loadActivities() {
    const token = localStorage.getItem('strava_token');
    if (!token) {
        console.error('No access token found');
        demo();
        return;
    }

    // Load activities from Strava API
    fetch('https://www.strava.com/api/v3/athlete/activities?per_page=200', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(activities => {
        if (activities && activities.length > 0) {
            drawHeatmap(activities);
        } else {
            console.error('No activities found');
            demo();
        }
    })
    .catch(error => {
        console.error('Error loading activities:', error);
        demo();
    });
}
