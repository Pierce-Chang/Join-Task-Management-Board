let contacts = [];

async function init() {
  loadContacts();
}

async function loadContacts() {
  try {
    contacts = JSON.parse(await getItem("contacts"));
    displayContacts();
  } catch (e) {
    console.error("Loading error:", e);
  }
}

function showAddContactOverlay() {
  document.getElementById("addContactOverlay").style.display = "flex";
}

function hideAddContactOverlay() {
  document.getElementById("addContactOverlay").style.display = "none";
}

function showEditContactOverlay() {
  document.getElementById("editContactOverlay").style.display = "flex";
}

function hideEditContactOverlay() {
  document.getElementById("editContactOverlay").style.display = "none";
}

async function addContact() {
  let name = document.getElementById("addContactName").value;
  let email = document.getElementById("addContactEmail").value;
  let phone = document.getElementById("addContactPhone").value;
  let initials = getInitials(name);

  contacts.push({
    name: name,
    email: email,
    phone: phone,
    initials: initials,
  });

  await setItem("contacts", JSON.stringify(contacts));
}

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function displayContacts() {
  let contactListDiv = document.getElementById("contactList");
  let bigContactDiv = document.getElementById("rightSideContactHeader");

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
                <button class="contact_initial_image">${initials}</button>
                <div class="contact_name_mail">
                    <div class="contact_name">${contact.name}</div>
                    <div class="contact_mail">
                        <a a href="mailto:${contact.email}">${contact.email}</a>
                    </div>
                </div>
            </div>`;
  });
}

// function to show Contact Informations
function showContactInfo(contactIndex) {
  let contact = contacts[contactIndex];
  let bigContactDiv = document.getElementById("contactDetails");
  bigContactDiv.innerHTML = `
            <div class="big_contact_top">
                <div class="big_contact_initial_image"><button>${getInitials(
                  contact.name
                )}</button></div>
                <div class="big_contact_name_settings">
                    <div class="big_contact_name">${contact.name}</div>
                    <div class="big_contact_settings">
                        <button onclick="showAddContactOverlay()"><img src="./img/edit.png" alt="Edit Icon">Edit</button>
                        <button><img src="./img/delete_contact.png" alt="Delete Icon">Delete</button>
                    </div>
                </div>
            </div>
            <div class="big_contact_info">
                <div class="big_contact_headline">Contact Information</div>
                <div class="big_contact_mail">
                    <b>Email</b>
                    <div class="contact_mail"><a href="mailto:${
                      contact.email
                    }">${contact.email}</a></div>
                </div>
                <div class="big_contact_phone">
                    <b>Phone</b>
                    ${contact.phone}
                </div>
        </div>`;
}
