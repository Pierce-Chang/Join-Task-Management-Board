/**
 * Contact Management Application
 */

// Global variables
let contacts = [];
let selectedContactIndex = -1;

// Array with contact colors
const contactColors = [
  "#FFB6C1",
  "#FFD700",
  "#87CEEB",
  "#98FB98",
  "#FFA07A",
  "#FF69B4",
  "#9370DB",
  "#20B2AA",
  "#87CEFA",
  "#FF6347"
];

/**
 * Initialize the application.
 */
async function init() {
  loadContacts();
}

/**
 * Load contacts from storage and display them.
 */
async function loadContacts() {
  try {
    contacts = JSON.parse(await getItem("contacts"));
    // Check if colors are already saved
    let savedColors = JSON.parse(localStorage.getItem("contactColors"));
    if (savedColors) {
      // If saved, assign colors to the contacts
      contacts.forEach((contact, index) => {
        contact.color = savedColors[index];
      });
    } else {
      // If not saved, assign random colors
      contacts.forEach((contact, index) => {
        contact.color = contactColors[index % contactColors.length];
      });
      // Save colors in localStorage
      localStorage.setItem(
        "contactColors",
        JSON.stringify(contacts.map((contact) => contact.color))
      );
    }
    displayContacts();
  } catch (e) {
    console.error("Loading error:", e);
  }
}

/**
 * Show the overlay for adding a new contact.
 */
function showAddContactOverlay() {
  document.getElementById("addContactOverlay").style.display = "flex";
}

/**
 * Hide the overlay for adding a new contact.
 */
function hideAddContactOverlay() {
  document.getElementById("addContactOverlay").style.display = "none";
}

/**
 * Show the overlay for editing a contact.
 * @param {number} contactIndex - The index of the contact to edit.
 */
function showEditContactOverlay(contactIndex) {
  selectedContactIndex = contactIndex;
  document.getElementById("editContactOverlay").style.display = "flex";
  populateEditFields(contactIndex);
}

/**
 * Hide the overlay for editing a contact.
 */
function hideEditContactOverlay() {
  document.getElementById("editContactOverlay").style.display = "none";
}

/**
 * Add a new contact to the list.
 */
async function addContact() {
  let name = document.getElementById("addContactName").value;
  let email = document.getElementById("addContactEmail").value;
  let phone = document.getElementById("addContactPhone").value;
  let initials = getInitials(name);

  if (name.length < 3 || email.length < 3 || phone.length < 3) {
    tooFewLettersWarning();
    return;
  }

  // Choose a random color for the contact
  let randomColor =
    contactColors[Math.floor(Math.random() * contactColors.length)];

  contacts.push({
    name: name,
    email: email,
    phone: phone,
    initials: initials,
    color: randomColor,
  });

  // Update colors in localStorage
  localStorage.setItem(
    "contactColors",
    JSON.stringify(contacts.map((contact) => contact.color))
  );

  await setItem("contacts", JSON.stringify(contacts));
  displayContacts();
}

/**
 * Get the initials from a name.
 * @param {string} name - The name to extract initials from.
 * @returns {string} The initials.
 */
function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

/**
 * Display the list of contacts.
 */
function displayContacts() {
  let contactListDiv = document.getElementById("contactList");
  let bigContactDiv = document.getElementById("rightSideContactHeader");

  contactListDiv.innerHTML = "";
  contacts.sort((a, b) => a.name.localeCompare(b.name));

  let currentInitial = "";
  contacts.forEach((contact, index) => {
    let initials = getInitials(contact.name);
    let firstInitial = initials.charAt(0).toUpperCase();

    if (firstInitial !== currentInitial) {
      currentInitial = firstInitial;
      contactListDiv.innerHTML += `
        <div class="contact_letter">${currentInitial}</div>
        <div class="space_line"></div>`;
    }

    contactListDiv.innerHTML += `
      <div class="contact" onclick="showContactInfo(${index})">
        <button class="contact_initial_image" style="background-color: ${contact.color}">${initials}</button>
        <div class="contact_name_mail">
          <div class="contact_name">${contact.name}</div>
          <div class="contact_mail">
            <a a href="mailto:${contact.email}">${contact.email}</a>
          </div>
        </div>
      </div>`;
  });
}

/**
 * Display the details of a selected contact.
 * @param {number} contactIndex - The index of the contact to display.
 */
function showContactInfo(contactIndex) {
  let contact = contacts[contactIndex];
  let bigContactDiv = document.getElementById("contactDetails");
  bigContactDiv.innerHTML = `
    <div class="big_contact_top">
      <div class="big_contact_initial_image"><button style="background-color: ${
        contact.color
      }">${getInitials(contact.name)}</button></div>
      <div class="big_contact_name_settings">
        <div class="big_contact_name">${contact.name}</div>
        <div class="big_contact_settings">
          <button onclick="showEditContactOverlay(${contactIndex})"><img src="./img/edit.png" alt="Edit Icon">Edit</button>
          <button onclick="deleteContact(${contactIndex})"><img src="./img/delete_contact.png" alt="Delete Icon">Delete</button>
        </div>
      </div>
    </div>
    <div class="big_contact_info">
      <div class="big_contact_headline">Contact Information</div>
      <div class="big_contact_mail">
        <b>Email</b>
        <div class="contact_mail"><a href="mailto:${contact.email}">${
    contact.email
  }</a></div>
      </div>
      <div class="big_contact_phone">
        <b>Phone</b>
        ${contact.phone}
      </div>
    </div>`;
}

/**
 * Delete a contact.
 * @param {number} contactIndex - The index of the contact to delete.
 */
function deleteContact(contactIndex) {
  if (confirm("Are you sure you want to delete this contact?")) {
    contacts.splice(contactIndex, 1);
    localStorage.setItem("contactColors", JSON.stringify(contacts.map((contact) => contact.color)));
    setItem("contacts", JSON.stringify(contacts));
    displayContacts();
    hideEditContactOverlay();
    let bigContactDiv = document.getElementById("contactDetails");
    bigContactDiv.innerHTML = '';
  }
}

/**
 * Save changes to a contact.
 */
function saveContact() {
  let editContactName = document.getElementById("editContactName").value;
  let editContactEmail = document.getElementById("editContactEmail").value;
  let editContactPhone = document.getElementById("editContactPhone").value;

  contacts[selectedContactIndex].name = editContactName;
  contacts[selectedContactIndex].email = editContactEmail;
  contacts[selectedContactIndex].phone = editContactPhone;

  setItem("contacts", JSON.stringify(contacts));
  displayContacts(selectedContactIndex);
  showContactInfo(selectedContactIndex);
  hideEditContactOverlay();
}


/**
 * Populate the edit fields with contact information.
 * @param {number} contactIndex - The index of the contact to populate the fields for.
 */
function populateEditFields(contactIndex) {
  let contact = contacts[contactIndex];
  document.getElementById("editContactName").value = contact.name;
  document.getElementById("editContactEmail").value = contact.email;
  document.getElementById("editContactPhone").value = contact.phone;
  let initialsButton = document.getElementById("editContactInitials");
  initialsButton.innerText = getInitials(contact.name);
  initialsButton.style.backgroundColor = contact.color;
}

/**
 * Display a warning when there are too few letters in the input fields.
 */
function tooFewLettersWarning() {
  alert(
    "Please enter at least 3 letters in the name, email address, and phone number."
  );
}