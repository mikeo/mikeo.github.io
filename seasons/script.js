const seasons = [];
let currentSeasonIndex = 0;
let activeSeasonIndex = 0;


var weekday=new Array(7);
weekday[0]="Sunday";
weekday[1]="Monday";
weekday[2]="Tuesday";
weekday[3]="Wednesday";
weekday[4]="Thursday";
weekday[5]="Friday";
weekday[6]="Saturday";

var months=new Array(12);
months[0]="January"
months[1]="February"
months[2]="March"
months[3]="April"
months[4]="May"
months[5]="June"
months[6]="July"
months[7]="August"
months[8]="September"
months[9]="October"
months[10]="November"
months[11]="December"


function getNextMondays(count) {
    const mondays = [];
    const currentDate = new Date();
    currentDate.setHours(5)
    // Start from the next Monday
    currentDate.setMonth(currentDate.getMonth() - 4);
    currentDate.setDate(currentDate.getDate() + ((1 + 7 - currentDate.getDay())));


    
    for (let i = 0; i < count; i++) {
        mondays.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 7); // Move to the next Monday
    }
    return mondays;
}

function filterLastMondays(mondays) {
    const lastMondays = {};
    mondays.forEach(monday => {
        const monthYear = `${monday.getFullYear()}-${monday.getMonth()}`; // Group by year and month
        if (!lastMondays[monthYear] || monday > lastMondays[monthYear]) {
            lastMondays[monthYear] = monday; // Keep the last Monday of the month
        }
    });
    return Object.values(lastMondays);
}

function generateSeasons() {
    const mondays = getNextMondays(50); // Get the next 50 Mondays
    const lastMondays = filterLastMondays(mondays); // Filter to keep only the last Monday of each month

    for (let i = 0; i < lastMondays.length - 2; i++) { 
        const startDate = lastMondays[i];
        const endDate = lastMondays[i + 1];
        const durationInWeeks = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24 * 7));
        let seasonName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(startDate);
        let durationText = `${durationInWeeks} weeks `
        const dateNow = new Date()
        if (startDate < dateNow & dateNow < endDate){
            activeSeasonIndex = i;
            seasonName = "⭐" + seasonName + "⭐"
            durationText = durationText + " (current)"
            currentSeasonIndex = i;
        }

        seasons.push({
            name: seasonName,
            startDate: startDate,
            endDate: endDate,
            duration: durationText,
            endDateObj: endDate // Store the end date as a Date object for the countdown
        });
    }
}

function displaySeasons() {
    const seasonsList = document.getElementById('seasons-list');
    seasonsList.innerHTML = '';

    seasons.forEach((season, index) => {
        const seasonDiv = document.createElement('div');
        seasonDiv.textContent = `${season.name} - ${season.duration}`;
        if(index == activeSeasonIndex){
            seasonDiv.style.fontWeight = "bold";
        }
        seasonDiv.addEventListener('click', () => {
            currentSeasonIndex = index;
            updateSeasonDetails();
        });
        seasonsList.appendChild(seasonDiv);
    });
}

function updateSeasonDetails() {
    const season = seasons[currentSeasonIndex];
    document.getElementById('season-name').textContent = season.name;
    document.getElementById('season-start').textContent = `${weekday[season.startDate.getDay()]} ${season.startDate.getDate()} ${months[season.startDate.getMonth()]} ${season.startDate.getFullYear()}`;
    document.getElementById('season-end').textContent = `${weekday[season.endDate.getDay()]} ${season.endDate.getDate()} ${months[season.endDate.getMonth()]} ${season.endDate.getFullYear()}`;
    document.getElementById('season-duration').textContent = season.duration;
}

function updateCurrentSeason() {
    const now = new Date();
    const currentSeason = seasons.find(season => now >= new Date(season.startDate) && now <= new Date(season.endDate));

    if (currentSeason) {
        document.getElementById('current-season-name').textContent = currentSeason.name;
        startCountdown(currentSeason.endDateObj);
    } else {
        document.getElementById('current-season-name').textContent = "No active season";
        document.getElementById('time-remaining').textContent = "N/A";
    }
}

function startCountdown(endDate) {
    const timerElement = document.getElementById('time-remaining');
    const updateTimer = () => {
        const now = new Date();
        const timeRemaining = endDate - now;

        if (timeRemaining > 0) {
            const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
            timerElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        } else {
            timerElement.textContent = "Season ended";
            clearInterval(interval);
        }
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000); // Update every second
}

// Initialize
generateSeasons();
updateSeasonDetails();
updateCurrentSeason();
displaySeasons();
