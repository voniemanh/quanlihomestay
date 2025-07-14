import { useState } from "react";

const guests = [
  { id: 1, guestName: "John Smith", phone: "0901234567", email: "john.smith@example.com" },
  { id: 2, guestName: "Emily Johnson", phone: "0912345678", email: "emily.johnson@example.com" },
  { id: 3, guestName: "Michael Brown", phone: "0923456789", email: "michael.brown@example.com" },
  { id: 4, guestName: "Sophia Davis", phone: "0934567890", email: "sophia.davis@example.com" },
  { id: 5, guestName: "Daniel Wilson", phone: "0945678901", email: "daniel.wilson@example.com" },
];

const initialData = [
  {
    id: 1,
    homestayName: "Sunrise Retreat",
    price: 850000,
    address: "123 Beach Road, Nha Trang",
    roomNo: 3,
    guestName: "",
    rentalCount: 0,
  },
  {
    id: 2,
    homestayName: "Ocean Breeze Villa",
    price: 950000,
    address: "45 Tran Phu, Da Nang",
    roomNo: 2,
    guestName: "",
    rentalCount: 0,
  },
  {
    id: 3,
    homestayName: "Mountain View Lodge",
    price: 750000,
    address: "88 Hilltop Road, Da Lat",
    roomNo: 4,
    guestName: "",
    rentalCount: 0,
  },
  {
    id: 4,
    homestayName: "Riverside Cottage",
    price: 650000,
    address: "12 Riverside Street, Hoi An",
    roomNo: 1,
    guestName: "",
    rentalCount: 0,
  },
  {
    id: 5,
    homestayName: "City Lights Studio",
    price: 700000,
    address: "789 Le Loi, Ho Chi Minh City",
    roomNo: 2,
    guestName: "",
    rentalCount: 0,
  },
];

function App() {
  const [homestays, setHomestays] = useState(initialData);
  const [originalData, setOriginalData] = useState(initialData);
  const [filters, setFilters] = useState({ homestayName: "", price: "", address: "", roomNo: "" });
  const [sortAsc, setSortAsc] = useState(true);
  const [newHomestay, setNewHomestay] = useState({
    homestayName: "",
    price: "",
    address: "",
    roomNo: "",
  });

  const handleSearch = () => {
  const filtered = originalData.filter((item) => {
    return (
      (!filters.homestayName || item.homestayName.toLowerCase().includes(filters.homestayName.toLowerCase())) &&
      (!filters.address || item.address.toLowerCase().includes(filters.address.toLowerCase())) &&
      (!filters.price || item.price === Number(filters.price)) &&
      (!filters.roomNo || item.roomNo === Number(filters.roomNo))
    );
  });
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
    const updated = originalData.map((item) => {
      const current = homestays.find((h) => h.id === item.id);
      return {
        ...item,
        rentalCount: current ? current.rentalCount : 0,
        guestName: current ? current.guestName : "",
      };
    });
    setHomestays(updated);
    setFilters({ homestayName: "", price: "", address: "", roomNo: "" });
  };

  const handleCheckout = (id) => {
    const updated = homestays.map((h) =>
      h.id === id ? { ...h, guestName: "" } : h
    );
    setHomestays(updated);
  };

  const handleAddHomestay = () => {
    const { homestayName, price, address, roomNo } = newHomestay;
    if (!homestayName || !price || !address || !roomNo) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const newItem = {
      id: homestays.length + 1,
      homestayName,
      price: Number(price),
      address,
      roomNo: Number(roomNo),
      guestName: "",
      rentalCount: 0,
    };

    const updatedList = [...homestays, newItem];
    const updatedOriginal = [...originalData, newItem];

    setHomestays(updatedList);
    setOriginalData(updatedOriginal);
    setNewHomestay({ homestayName: "", price: "", address: "", roomNo: "" });
  };

  return (
    <>
      <h1>Guests List</h1>
      <Guests guests={guests} />

      <h2>Add New Homestay</h2>
      <AddHomestay
        newHomestay={newHomestay}
        setNewHomestay={setNewHomestay}
        handleAddHomestay={handleAddHomestay}
      />

      <h1>Homestay's Rooms List</h1>
      <Search
        filters={filters}
        setFilters={setFilters}
        handleSearch={handleSearch}
      />
      <Sort handleSort={handleSort} sortAsc={sortAsc} />
      <Reset handleReset={handleReset} />
      <Homestays
        homestays={homestays}
        setHomestays={setHomestays}
        onCheckout={handleCheckout}
        guests={guests}
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

function Homestays({ homestays, setHomestays, onCheckout, guests }) {
  const [selectingRentalId, setSelectingRentalId] = useState(null);
  const [selectedGuestId, setSelectedGuestId] = useState(null);

  const handleRental = (id) => {
    setSelectingRentalId(id);
    setSelectedGuestId(null);
  };

  const handleConfirmRental = (id) => {
    if (!selectedGuestId) {
      alert("Vui lòng chọn khách!");
      return;
    }

    const selectedGuest = guests.find((g) => g.id === Number(selectedGuestId));
    const updated = homestays.map((h) =>
      h.id === id
        ? { ...h, guestName: selectedGuest.guestName, rentalCount: h.rentalCount + 1 }
        : h
    );
    setHomestays(updated);
    setSelectingRentalId(null);
    setSelectedGuestId(null);
  };

  return (
    <table border={1}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Homestay Name</th>
          <th>Price</th>
          <th>Address</th>
          <th>Room No</th>
          <th>Guest Name</th>
          <th>Rental Count</th>
          <th></th>
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
            <td>
              {selectingRentalId === home.id ? (
                <select
                  value={selectedGuestId || ""}
                  onChange={(e) => setSelectedGuestId(e.target.value)}
                >
                  <option value="">-- Chọn khách --</option>
                  {guests.map((guest) => (
                    <option key={guest.id} value={guest.id}>
                      {guest.guestName}
                    </option>
                  ))}
                </select>
              ) : (
                home.guestName || "-"
              )}
            </td>
            <td>{home.rentalCount}</td>
            <td>
              {!home.guestName ? (
                selectingRentalId === home.id ? (
                  <>
                    <button onClick={() => handleConfirmRental(home.id)}>Confirm</button>
                    <button onClick={() => setSelectingRentalId(null)}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => handleRental(home.id)}>Rental</button>
                )
              ) : (
                <button onClick={() => onCheckout(home.id)}>Check out</button>
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
      <input placeholder="Homestay Name" value={filters.homestayName} onChange={handleChange("homestayName")} />
      <input placeholder="Price" type="number" value={filters.price} onChange={handleChange("price")} />
      <input placeholder="Address" value={filters.address} onChange={handleChange("address")} />
      <input placeholder="Room No" type="number" value={filters.roomNo} onChange={handleChange("roomNo")} />
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

function AddHomestay({ newHomestay, setNewHomestay, handleAddHomestay }) {
  const handleChange = (field) => (e) => {
    setNewHomestay({ ...newHomestay, [field]: e.target.value });
  };

  return (
    <>
      <input placeholder="Homestay Name" value={newHomestay.homestayName} onChange={handleChange("homestayName")} />
      <input placeholder="Price" type="number" value={newHomestay.price} onChange={handleChange("price")} />
      <input placeholder="Address" value={newHomestay.address} onChange={handleChange("address")} />
      <input placeholder="Room No" type="number" value={newHomestay.roomNo} onChange={handleChange("roomNo")} />
      <button onClick={handleAddHomestay}>Add Homestay</button>
    </>
  );
}

export default App;
