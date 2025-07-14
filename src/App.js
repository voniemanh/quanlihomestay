import { useState } from "react";

const guests = [
  { id: 1, guestName: "John Smith", phone: "0901234567", email: "john.smith@example.com" },
  { id: 2, guestName: "Emily Johnson", phone: "0912345678", email: "emily.johnson@example.com" },
  { id: 3, guestName: "Michael Brown", phone: "0923456789", email: "michael.brown@example.com" },
  { id: 4, guestName: "Sophia Davis", phone: "0934567890", email: "sophia.davis@example.com" },
  { id: 5, guestName: "Daniel Wilson", phone: "0945678901", email: "daniel.wilson@example.com" },
];

const homestayData = [
  { id: 1, homestayName: "Sunrise Retreat", price: 850000, address: "123 Beach Road, Nha Trang", roomNo: 3, guestName: "", rentalCount: 0 },
  { id: 2, homestayName: "Mountain Breeze Villa", price: 1200000, address: "45 Ly Thuong Kiet St, Da Lat", roomNo: 5, guestName: "", rentalCount: 0 },
  { id: 3, homestayName: "Riverside Nest", price: 750000, address: "78 Nguyen Du St, Hoi An", roomNo: 2, guestName: "", rentalCount: 0 },
  { id: 4, homestayName: "Palm Garden House", price: 980000, address: "12 Tran Hung Dao St, Phu Quoc", roomNo: 4, guestName: "", rentalCount: 0 },
  { id: 5, homestayName: "Skyline Studio", price: 1100000, address: "89 Le Loi St, Da Nang", roomNo: 1, guestName: "", rentalCount: 0 },
];

function App() {
  const [homestays, setHomestays] = useState(homestayData);
  const [filters, setFilters] = useState({ homestayName: "", price: "", address: "", roomNo: "" });
  const [sortAsc, setSortAsc] = useState(true);

  const handleSearch = () => {
    const filtered = homestayData.filter((item) =>
      item.homestayName.toLowerCase().includes(filters.homestayName.toLowerCase()) &&
      item.address.toLowerCase().includes(filters.address.toLowerCase()) &&
      (filters.price === "" || item.price === Number(filters.price)) &&
      (filters.roomNo === "" || item.roomNo === Number(filters.roomNo))
    );
    setHomestays(filtered);
  };

  const handleSort = () => {
    const sorted = [...homestays].sort((a, b) =>
      sortAsc ? a.price - b.price : b.price - a.price
    );
    setHomestays(sorted);
    setSortAsc(!sortAsc);
  };

  const handleReset = () => {
    const updated = homestayData.map((item) => {
      const existing = homestays.find((h) => h.id === item.id);
      return {
        ...item,
        rentalCount: existing ? existing.rentalCount : 0,
      };
    });
    setHomestays(updated);
    setFilters({ homestayName: "", price: "", address: "", roomNo: "" });
  };

  const handleRental = (id) => {
    const guestName = prompt("Nhập tên khách:");
    if (!guestName) return;

    const guestExists = guests.some(
      (guest) => guest.guestName.toLowerCase() === guestName.trim().toLowerCase()
    );

    if (!guestExists) {
      alert("Khách không tồn tại trong danh sách! Vui lòng kiểm tra lại.");
      return;
    }

    const updated = homestays.map((h) =>
      h.id === id ? { ...h, guestName, rentalCount: h.rentalCount + 1 } : h
    );
    setHomestays(updated);
  };

  const handleCheckout = (id) => {
    const updated = homestays.map((h) =>
      h.id === id ? { ...h, guestName: "" } : h
    );
    setHomestays(updated);
  };

  return (
    <>
      <h1>Guests List</h1>
      <Guests guests={guests} />

      <h1>Homestay's Rooms List</h1>
      <Search
        filters={filters}
        setFilters={setFilters}
        handleSearch={handleSearch}
        handleReset={handleReset}
      />
      <Sort handleSort={handleSort} sortAsc={sortAsc} />
      <Reset handleReset={handleReset} />
      <Homestays
        homestays={homestays}
        onRental={handleRental}
        onCheckout={handleCheckout}
      />
    </>
  );
}

function Guests({ guests }) {
  return (
    <table border={1}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Guest Name</th>
          <th>Phone</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {guests.map((guest) => (
          <tr key={guest.id}>
            <td>{guest.id}</td>
            <td>{guest.guestName}</td>
            <td>{guest.phone}</td>
            <td>{guest.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Homestays({ homestays, onRental, onCheckout }) {
  return (
    <table border={1}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Homestay Name</th>
          <th>Price (VND)</th>
          <th>Address</th>
          <th>Room's No</th>
          <th>Guest Name</th>
          <th>Rental Count</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {homestays.map((home) => (
          <tr key={home.id}>
            <td>{home.id}</td>
            <td>{home.homestayName}</td>
            <td>{home.price.toLocaleString()}</td>
            <td>{home.address}</td>
            <td>{home.roomNo}</td>
            <td>{home.guestName || "-"}</td>
            <td>{home.rentalCount}</td>
            <td>
              {!home.guestName ? (
                <button onClick={() => onRental(home.id)}>Rental</button>
              ) : (
                <button onClick={() => onCheckout(home.id)}>Trả phòng</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Search({ filters, setFilters, handleSearch }) {
  const handleChange = (key) => (e) => {
    setFilters({ ...filters, [key]: e.target.value });
  };

  return (
    <>
      <input
        placeholder="Homestay Name"
        value={filters.homestayName}
        onChange={handleChange("homestayName")}
      />
      <input
        placeholder="Homestay Price"
        type="number"
        value={filters.price}
        onChange={handleChange("price")}
      />
      <input
        placeholder="Homestay Address"
        value={filters.address}
        onChange={handleChange("address")}
      />
      <input
        placeholder="Room No"
        type="number"
        value={filters.roomNo}
        onChange={handleChange("roomNo")}
      />
      <button onClick={handleSearch}>Search</button>
    </>
  );
}

function Sort({ handleSort, sortAsc }) {
  return <button onClick={handleSort}>Sort by Price {sortAsc ? "↑" : "↓"}</button>;
}

function Reset({ handleReset }) {
  return <button onClick={handleReset}>Reset</button>;
}

export default App;
