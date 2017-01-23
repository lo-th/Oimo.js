/**
* A link list of contacts.
* @author saharan
*/
function ContactLink ( contact ){
    
	// The previous contact link.
    this.prev = null;
    // The next contact link.
    this.next = null;
    // The shape of the contact.
    this.shape = null;
    // The other rigid body.
    this.body = null;
    // The contact of the link.
    this.contact = contact;

}

export { ContactLink };