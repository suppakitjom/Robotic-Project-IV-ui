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

document.getElementById("openScheduleModalBtn").onclick = function () {
	showScheduleModal(); // You might need to adjust showModal function if it requires parameters
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

// Get the modal element
var modal = document.getElementById("myModal");
// Get the element that closes the modal
var span = document.getElementsByClassName("close")[0];
// Get the paragraph inside the modal where the text will be displayed
var modalText = document.getElementById("modalText");

// Function to open the modal with a specific message
function showModal(message) {
	modalText.textContent = message;
	modal.style.display = "block";
}
// When the user clicks on <span> (x), close the modal
span.onclick = function () {
	modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
	if (event.target == modal) {
		modal.style.display = "none";
		scheduleModal.style.display = "none";
	}
};

// After the window.onload function
var scheduleModal = document.getElementById("scheduleModal"); // Make sure this ID matches the one in the HTMLs
// Get the close button element for the schedule modal
var scheduleSpan = document.getElementsByClassName("closeSchedule")[0]; // Assuming there's only one, use querySelector
var scheduleModalText = document.getElementById("scheduleModalText");

function showScheduleModal(message) {
	scheduleModalText.textContent = message;
	scheduleModal.style.display = "block";
}

scheduleSpan.onclick = function () {
	scheduleModal.style.display = "none";
};

// Replace previous alert calls with showModal
document.getElementById("feedNowBtn").onclick = function () {
	fetch("http://172.20.10.2:5432/api/feed", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ feedNow: true }),
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		})
		.then((data) => {
			showModal("Your pet has been fed!");
		})
		.catch((error) => {
			showModal("Failed to feed your pet. Please try again!");
		});
};

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

		// Instead of alert, use showModal to display confirmation
		showScheduleModal("Schedule set successfully for " + timeString);
	} else {
		// Use showModal instead of alert for error message
		showScheduleModal("This time is already scheduled.");
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
	fetch("http://172.20.10.2:5432/api/schedule", {
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
