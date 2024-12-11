import React, { useState } from "react";
import axios from "axios";

const AddLead = () => {
  const [formData, setFormData] = useState({
    title: "",
    name: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      fields: {
        TITLE: formData.title,
        NAME: formData.name,
        LAST_NAME: formData.lastName,
        EMAIL: [{ VALUE: formData.email, VALUE_TYPE: "WORK" }],
        PHONE: [{ VALUE: formData.phone, VALUE_TYPE: "MOBILE" }],
        SOURCE_ID: formData.sourceId || "WEB",
        STATUS_ID: formData.statusId || "NEW",
        COMPANY_TITLE: formData.companyTitle || "",
        COMMENTS: formData.comments || "",
      },
      params: { REGISTER_SONET_EVENT: "Y" },
    };

    try {
      const response = await axios.post(
        "https://b24-vhllhk.bitrix24.com/rest/1/w87hywenqphcvbe7/crm.lead.add.json",
        data
      );
      alert(`Lead uğurla əlavə edildi! ID: ${response.data.result}`);
    } catch (error) {
      console.error("Lead əlavə edilmədi:", error);
      alert("Xəta baş verdi. Lead əlavə edilmədi.");
    }
  };

  return (
    <div className="container">
      <h1>Yeni Lead Əlavə Et</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Lead Başlığı"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Ad"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Soyad"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Telefon"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="sourceId"
          placeholder="Mənbə (SOURCE_ID)"
          value={formData.sourceId || ""}
          onChange={handleChange}
        />
        <input
          type="text"
          name="statusId"
          placeholder="Status (STATUS_ID)"
          value={formData.statusId || ""}
          onChange={handleChange}
        />
        <input
          type="text"
          name="companyTitle"
          placeholder="Şirkət Adı (COMPANY_TITLE)"
          value={formData.companyTitle || ""}
          onChange={handleChange}
        />
        <div className="comments-container">
          <textarea
            name="comments"
            placeholder="Qeydlər"
            value={formData.comments || ""}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Əlavə Et</button>
      </form>
    </div>
  );
};

export default AddLead;
