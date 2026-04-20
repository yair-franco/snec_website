//All members data stored in members.json
//Can be updated manually as more members join/leave the organization
``

console.log("Yair Franco, 2026");
const members_data = './members.json';

loadMembers();

// Function to fetch and process the members data
async function loadMembers() {
    try {
        // Fetch the JSON file
        const response = await fetch(members_data);

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Failed to fetch members.json: ${response.statusText}`);
        }

        // Parse the JSON data
        const data = await response.json();

        // Process the members data
        let members = data.members;

        //Sort alphabetically by surname
        //Assumes surname is the last whitespace-separated word in the name (i.e. it will include hyphens)
        //For some naming customs (e.g. Chinese, Hispanic) the family name is not the last word in the name
        //The JSON data should be formatted after the individual's preferred naming custom

        //First member (director) is left as the first index
        const firstMember = members[0];
        const remainingMembers = members.slice(1);

        remainingMembers.sort((a, b) => {
            const lastNameA = a.name.split(' ').pop().toLowerCase(); // Get last name of member A
            const lastNameB = b.name.split(' ').pop().toLowerCase(); // Get last name of member B
            return lastNameA.localeCompare(lastNameB); // Compare last names
        });

        members = [firstMember, ...remainingMembers];

        generatePortraits(members);
        console.log("Portraits loaded successfully")
    } catch (error) {
        console.error('Error loading members:', error);
        
    }
}

//This code relies on JQuery for html element generation

function generatePortraits(members) {
    const max_per_row = 4
    let imgs_this_row = 0

    //Create container for first row of portraits
    let portrait_row = $('<div></div>', {
        "class": "portrait_row row_top scripted"
    });

    members.forEach(member => {
        //Parse JSON data for member
        const name = member.name;
        const role = member.role;
        const interests = member.interests;
        //if img field is blank (empty strings are falsy), use default portrait
        const img = member.img ? member.img : "default.jpg";
         
        //console.log("data:",name, role, interests, img)

        //Create html elements for each item 
        const img_elem = $('<img>')
            .addClass('portrait')
            .attr("src", `./img/${img}`);

        const name_elem = $('<p>')
            .addClass('name')
            .html(name);

        const role_elem = $('<p>')
            .addClass('port_desc')
            .html(role);

        const interests_elem = $('<i>')
            .addClass('port_desc')
            .html(interests);

        //Create portrait container div
        let portrait_cont = $('<div>')
            .addClass("col_center portrait_cont");

        // console.log(portrait_cont);

        //Fill container with member info elements
        portrait_cont.append(img_elem,name_elem,role_elem,interests_elem);

        if (imgs_this_row < max_per_row) {
            //Add filled container to row and count
            portrait_row.append(portrait_cont);
            imgs_this_row++;
        } else {
            //Append row if row is full
            $("#main_portrait_cont").append(portrait_row);

            //Reset row container
            portrait_row = $('<div></div>', {
                "class": "portrait_row row_top scripted"
            });

            imgs_this_row = 0;
            portrait_row.append(portrait_cont);
            imgs_this_row++;
        }
    });
    //After loop ends, appends remaining portraits
    $("#main_portrait_cont").append(portrait_row);
}           