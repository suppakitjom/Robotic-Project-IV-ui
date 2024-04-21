// Populate time options
window.onload = function () {
	const hourSelect = document.getElementById("hour");
	for (let i = 1; i <= 12; i++) {
		hourSelect.options[hourSelect.options.length] = new Option(i < 10 ? "0" + i : i.toString(), i);
	}
	hourSelect.value = "8"; // Set default hour to 8

	const minuteSelect = document.getElementById("minute");
	for (let i = 0; i < 60; i++) {
		minuteSelect.options[minuteSelect.options.length] = new Option(
			i < 10 ? "0" + i : i.toString(),
			i < 10 ? "0" + i : i.toString()
		);
	}
	minuteSelect.value = "00"; // Set default minute to 00

	// load schedules from local storage
	const scheduleList = document.getElementById("scheduleList");
	scheduleList.innerHTML = localStorage.getItem("scheduleList") || "";
	updateScheduleList();
	reattachDeleteHandlers(); // Reattach event handlers
};

function reattachDeleteHandlers() {
	const deleteButtons = document.querySelectorAll(".schedule-item button");
	deleteButtons.forEach((button) => {
		button.onclick = function () {
			const item = button.parentNode;
			item.parentNode.removeChild(item);
			updateScheduleList();
			localStorage.setItem("scheduleList", scheduleList.innerHTML);
		};
	});
}

// Handle the 'Feed Now' button
document.getElementById("feedNowBtn").onclick = function () {
	alert("Your pet is being fed right now!");
	// send a request to the server to feed the pet
	fetch("http://127.0.0.1:5000/feed", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ feedNow: true }),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
		})
		.catch((error) => {
			console.error("Error:", error);
		});
};

// Handle the 'Set Schedule' button
function setSchedule() {
	const hour = document.getElementById("hour").value;
	const minute = document.getElementById("minute").value;
	const ampm = document.getElementById("ampm").value;
	const scheduleList = document.getElementById("scheduleList");
	const timeString = `${hour}:${minute} ${ampm}`;

	if (!isDuplicate(timeString)) {
		const listItem = document.createElement("div");
		listItem.innerText = timeString;
		listItem.className = "schedule-item"; // Add a class for the item
		const deleteBtn = document.createElement("button");
		deleteBtn.innerText = "Delete";
		deleteBtn.onclick = function () {
			scheduleList.removeChild(listItem);
			updateScheduleList(); // Update the display after deleting a schedule
		};
		listItem.appendChild(deleteBtn);

		scheduleList.appendChild(listItem);
		updateScheduleList(); // Update the display after adding a new schedule
	} else {
		alert("This time is already scheduled.");
	}

	// add to local storage
	localStorage.setItem("scheduleList", scheduleList.innerHTML);
}

function isDuplicate(timeString) {
	const scheduleItems = document.querySelectorAll(".schedule-item");
	return Array.from(scheduleItems).some((item) => item.textContent.includes(timeString));
}

function updateScheduleList() {
	const scheduleList = document.getElementById("scheduleList");
	const noSchedules = document.getElementById("noSchedules") || createNoSchedulesElement();

	// Check for any .schedule-item elements, which represent actual schedules
	const scheduleItems = scheduleList.getElementsByClassName("schedule-item");

	if (scheduleItems.length === 0) {
		// If no schedules are present
		noSchedules.style.display = "block"; // Show the "No schedules set" message
	} else {
		noSchedules.style.display = "none"; // Otherwise, hide the message
	}

	// posts the schedules to the server
	const schedules = Array.from(scheduleItems).map((item) => item.textContent.trim().split("Delete")[0]);
	fetch("http://127.0.0.1:5000/schedule", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ schedules }),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
		})
		.catch((error) => {
			console.error("Error:", error);
		});
}

function createNoSchedulesElement() {
	const noSchedules = document.createElement("div");
	noSchedules.id = "noSchedules";
	noSchedules.textContent = "No schedules set.";
	noSchedules.style.display = "none"; // Start hidden
	const scheduleList = document.getElementById("scheduleList");
	scheduleList.appendChild(noSchedules); // Append it to the scheduleList container
	return noSchedules;
}
