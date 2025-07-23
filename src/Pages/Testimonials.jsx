import React, { useEffect, useState } from "react";
import AXIOS from "../utils/Axios_config";

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);

  const getTestimonials = async () => {
    const rasp = await AXIOS.get("/testimonials/getAll");
    if (rasp.data.success === true) setTestimonials(rasp.data.data);
  };

  useEffect(() => {
    getTestimonials();
  }, []);

  const update = async (uid, resp) => {
    const testimonial = testimonials.find((b) => b.id === uid);
    testimonial.accept = resp;
    await AXIOS.post("/testimonials/update", { uid, data: testimonial });
    getTestimonials();
  };

  const delete_data = async (uid) => {
    await AXIOS.post("/testimonials/delete", { uid });
    getTestimonials();
  };

  return (
    <div className="admin-container">
      <h1 className="testimonials-title">Testimoniale Clienți</h1>

      {testimonials &&
        testimonials
          .sort((a, b) => b.timestamp - a.timestamp)
          .map((testimonial, index) => (
            <div className="testimonial-card" key={index}>
              <div className="testimonial-info">
                {testimonial.img && <img src={testimonial.img} alt="" width={100} height={100} />}{" "}
                <h3 className="testimonial-name">{testimonial.name}</h3>
                <h4 className="testimonial-job">{testimonial.profesie}</h4>
                <p className="testimonial-message">{testimonial.mesaj}</p>
                <h5 className="testimonial-date">
                  {new Date(testimonial.timestamp).toLocaleString()}
                </h5>
              </div>

              <div className="testimonial-actions">
                {!testimonial.accept ? (
                  <button
                    className="btn accept"
                    onClick={() => update(testimonial.id, true)}
                  >
                    Acceptă
                  </button>
                ) : (
                  <button
                    className="btn reject"
                    onClick={() => update(testimonial.id, false)}
                  >
                    Refuză
                  </button>
                )}

                <button
                  className="btn delete"
                  onClick={() => delete_data(testimonial.id)}
                >
                  Șterge
                </button>
              </div>
            </div>
          ))}
    </div>
  );
}

export default Testimonials;
