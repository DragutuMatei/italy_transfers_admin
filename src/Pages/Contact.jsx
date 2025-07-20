// import React, { useEffect, useState } from "react";
// import AXIOS from "../utils/Axios_config";

// function Contact() {
//   const [contacts, setContacts] = useState([]);

//   const getContacts = async () => {
//     const rasp = await AXIOS.get("/contact/getAll");
//     if (rasp.data.success === true) setContacts(rasp.data.data);
//   };

//   useEffect(() => {
//     getContacts();
//   }, []);

//   const delete_data = async (uid) => {
//     await AXIOS.post("/contact/delete", { uid });

//     getContacts();
//   };

//   return (
//     <>
//       {contacts &&
//         contacts.map((contact, index) => {
//           return (
//             <div className="contact-card" key={index}>
//               <div className="contact-info">
//                 <h3>{contact.name}</h3>
//                 <h5>{new Date(contact.time).toLocaleDateString()}</h5>
//                 <a href={`mailto: ${contact.email}`}>{contact.email}</a>
//                 <a href={`tel: ${contact.numar}`}>{contact.numar}</a>
//                 <p>{contact.mesaj}</p>
//               </div>
//               <button onClick={() => delete_data(contact.id)}>Delete</button>
//             </div>
//           );
//         })}
//     </>
//   );
// }

// export default Contact;
import React, { useEffect, useState } from "react";
import AXIOS from "../utils/Axios_config";

function Contact() {
  const [contacts, setContacts] = useState([]);

  const getContacts = async () => {
    const rasp = await AXIOS.get("/contact/getAll");
    if (rasp.data.success === true) setContacts(rasp.data.data);
  };

  useEffect(() => {
    getContacts();
  }, []);

  const delete_data = async (uid) => {
    await AXIOS.post("/contact/delete", { uid });
    getContacts();
  };

  return (
    <div className="admin-container">
      <h1 className="contact-title">Mesaje Contact</h1>

      {contacts && contacts.sort((a, b) => b.timestamp - a.timestamp).map((contact, index) => (
        <div className="contact-card" key={index}>
          <div className="contact-info">
            <div className="contact-header">
              <h3>{contact.name}</h3>
              <h5>{Date(contact.time).toString()}</h5>
            </div>
            <a href={`mailto:${contact.email}`} className="contact-link">
              {contact.email}
            </a>
            <a href={`tel:${contact.numar}`} className="contact-link">
              {contact.numar}
            </a>
            <p className="contact-message">{contact.mesaj}</p>
          </div>
          <button
            className="btn delete"
            onClick={() => delete_data(contact.id)}
          >
            Șterge
          </button>
        </div>
      ))}
    </div>
  );
}

export default Contact;
