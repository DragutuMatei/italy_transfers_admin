import React, { useEffect, useState } from "react";
import AXIOS from "../utils/Axios_config";
import { FaLongArrowAltRight } from "react-icons/fa";
import axios from "axios";
import { toast_promise } from "../utils/Toasts";

function Home() {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Debounce searchTerm
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    if (searchTerm !== debouncedSearch) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [searchTerm, debouncedSearch]);

  const getRides = async () => {
    const rasp = await AXIOS.get("/api/getAllUsers");
    if (rasp.data.success === true) setUsers(rasp.data.data);

    const rasps = await AXIOS.get("/books/getAll");
    if (rasps.data.success === true) setBooks(rasps.data.data);
  };

  useEffect(() => {
    getRides();
    // AXIOS.post("/platform/update", {decisition:true, data:{ok:false}, book_uid:'JOYQVS9BnJkESFwoO43q'})
  }, []);

  const update = async (uid, resp, book = null) => {
    const send = {
      cartype: book.masina.type,
      price: book.masina.results.total,
      bags: book.masina.bags,
      operator_note:
        book.notes +
        (book.specialPickupNumber
          ? ` Special pickup: ${book.specialPickupNumber}.`
          : "."),
      paxmail: book.email,
      pickup: book.origin.name,
      dropoff: book.destination.name,
      date: `${book.date.split("-")[2]}/${book.date.split("-")[1]}/${
        book.date.split("-")[0]
      }`,
      pickup_time: book.time,
      pax: book.masina.pers,
      paxname: book.masina.name,
      paxphone: book.masina.phone,
    };
    console.log({
      decisition: resp,
      data: send,
      book_uid: uid,
    });
    await toast_promise(
      AXIOS.post("/platform/update", {
        decisition: resp,
        data: send,
        book_uid: uid,
      })
    );
    // let book = books.find((b) => b.id === uid);
    // book.accept_book = resp;
    // if (resp) {

    //   const api_to_nccgest = await axios.post(
    //     `https://api.nccgest.com/api/rest_api.php?dominio=nrcvlad&token=g40oow84sck4s0kwgcco048s00kkwcgwo4swcgc0s04c8kwk0k8gck0gooogccsg&cmd=cmd_insert`,
    //     send,
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //         Accept: "application/json",
    //       },
    //     }
    //   );
    //   console.log(api_to_nccgest.data);
    //   book["serviceid"] = api_to_nccgest.data.serviceid;
    // }
    // await toast_promise(AXIOS.post("/books/update", { uid, data: book }));

    getRides();
  };

  const delete_data = async (user_uid, uid) => {
    await AXIOS.post("/books/delete", { uid });

    let updatedUser = users.find((u) => u.uid === user_uid);
    updatedUser.books = updatedUser.books.filter((b) => b !== uid);

    await AXIOS.post("/api/update", {
      uid: user_uid,
      data: updatedUser,
    });

    getRides();
  };

  const unsubscribeNewsletter = async (email) => {
    await toast_promise(AXIOS.delete("/api/newsletter", { data: { email } }));
    getRides();
  };

  let filteredUsers = users.filter((user) => {
    // Caută în nume/email
    const userMatch = `${user.displayName} ${user.email}`
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase());
    // Caută în serviceid-urile rezervărilor
    const bookMatch = user.books.some((book_uid) => {
      const book = books.find((b) => b.id === book_uid);
      if (!book) return false;
      return (
        (book.serviceid &&
          book.serviceid
            .toString()
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase())) ||
        (book.id &&
          book.id
            .toString()
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase()))
      );
    });
    return userMatch || bookMatch;
  });

  // Dacă debouncedSearch se potrivește cu un serviceid, userul respectiv să fie primul
  if (debouncedSearch.trim().length > 0) {
    const lowerSearch = debouncedSearch.toLowerCase();
    const matchIndex = filteredUsers.findIndex((user) =>
      user.books.some((book_uid) => {
        const book = books.find((b) => b.id === book_uid);
        if (!book) return false;
        return (
          (book.serviceid &&
            book.serviceid.toString().toLowerCase().includes(lowerSearch)) ||
          (book.id && book.id.toString().toLowerCase().includes(lowerSearch))
        );
      })
    );
    if (matchIndex > 0) {
      // Mută userul găsit pe prima poziție
      const [matchUser] = filteredUsers.splice(matchIndex, 1);
      filteredUsers = [matchUser, ...filteredUsers];
    }
  }

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Panel</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Caută utilizator după nume, email sau service id..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <span
          style={{
            marginLeft: 12,
            color: isSearching ? "#888" : "transparent",
            minWidth: 70,
            display: "inline-block",
            transition: "color 0.2s",
          }}
        >
          Căutare...
        </span>
      </div>

      {filteredUsers.map((user, index) => (
        <div className="user-card" key={index}>
          <div className="user-info">
            <img src={user.photoURL} alt={user.displayName} />
            <ul>
              <li className="user-name">{user.displayName}</li>
              <li className="user-email">
                <a
                  href={`mailto:${user.email}`}
                  style={{ color: "inherit", textDecoration: "underline" }}
                >
                  {user.email}
                </a>
              </li>
            </ul>
            {user.hasnews && (
              <button
                className="btn unsubscribe"
                style={{
                  marginTop: 8,
                  background: "#ff4c00",
                  color: "#fff",
                  borderRadius: 6,
                  padding: "6px 16px",
                  border: "none",
                  fontWeight: 600,
                }}
                onClick={() => unsubscribeNewsletter(user.email)}
              >
                Dezabonează newsletter
              </button>
            )}
          </div>

          {user.books.map((book_uid, idx) => {
            const userBooks = user.books
              .map((book_uid) => books.find((b) => b.id === book_uid))
              .filter(Boolean);

            // Dacă există searchTerm și se potrivește cu un service id/id, mută acel booking primul
            let sortedBooks = userBooks;
            if (debouncedSearch.trim().length > 0) {
              const lowerSearch = debouncedSearch.toLowerCase();
              const matchIndex = userBooks.findIndex(
                (book) =>
                  (book.serviceid &&
                    book.serviceid
                      .toString()
                      .toLowerCase()
                      .includes(lowerSearch)) ||
                  (book.id &&
                    book.id.toString().toLowerCase().includes(lowerSearch))
              );
              if (matchIndex > 0) {
                const [matchBook] = sortedBooks.splice(matchIndex, 1);
                sortedBooks = [matchBook, ...sortedBooks];
              }
            }

            return sortedBooks.map((book, idx) => (
              <div className="booking-card" key={book.id || idx}>
                <h2
                  className="booking-id"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    const idToCopy = book.serviceid ? book.serviceid : book.id;
                    navigator.clipboard.writeText(idToCopy);
                    if (window.toast) {
                      window.toast("Service ID copiat în clipboard!");
                    } else if (typeof toast_promise === "function") {
                      toast_promise(
                        Promise.resolve(),
                        "Service ID copiat în clipboard!"
                      );
                    } else {
                      alert("Service ID copiat în clipboard!");
                    }
                  }}
                >
                  Booking ID: {book.serviceid ? book.serviceid : book.id}
                </h2>

                <div className="booking-info">
                  <p>
                    <strong>Durată:</strong>{" "}
                    {book.is24h ? "Sub 24h" : "Peste 24h"}
                  </p>
                  <p>
                    <strong>Destinație:</strong>{" "}
                    {book.option === "hour" ? (
                      `${book.destination} ore`
                    ) : (
                      <span className="direction">
                        {book.origin.name} <FaLongArrowAltRight />{" "}
                        {book.destination.name}
                      </span>
                    )}
                  </p>
                  <p>
                    <strong>Data:</strong> {book.date} la {book.time}
                  </p>
                  <p>
                    <strong>Mașină:</strong> {book.masina.type}
                  </p>
                  <p>
                    <strong>Km:</strong> {book.masina.results.km} km
                  </p>
                  <p>
                    <strong>Client:</strong>{" "}
                    {book.book === "me"
                      ? "Clientul logat"
                      : book.name || "Anonim"}
                  </p>
                  <p>
                    <strong>Telefon:</strong> {book.phone}
                  </p>
                  {book.isSpecialPickup && book.specialPickupNumber && (
                    <p>
                      <strong>Flight/train/ship number:</strong>{" "}
                      {book.specialPickupNumber}
                    </p>
                  )}
                </div>

                {book.pay && (
                  <div className="payment-info">
                    <p>
                      <strong>Total:</strong> {book.masina.results.total} EUR
                    </p>
                    <p>
                      <strong>Plătit:</strong> {book.pay.total} EUR
                    </p>
                    <p className={book.payFull ? "pay-full" : "pay-partial"}>
                      {book.payFull
                        ? "Plata completă efectuată"
                        : `Rest: ${
                            book.masina.results.total - book.pay.total
                          } EUR`}
                    </p>
                  </div>
                )}

                <div className="booking-actions">
                  <button
                    className="btn delete"
                    onClick={() => delete_data(user.uid, book_uid)}
                  >
                    Șterge
                  </button>

                  {!book.accept_book && (
                    <>
                      <button
                        className="btn accept"
                        onClick={() => update(book_uid, true, book)}
                      >
                        Acceptă
                      </button>
                      <button
                        className="btn refuse"
                        onClick={() => update(book_uid, false)}
                      >
                        Refuză
                      </button>
                    </>
                  )}
                </div>
              </div>
            ));
          })}
        </div>
      ))}
    </div>
  );
}

export default Home;
