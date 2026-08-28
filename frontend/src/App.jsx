import { useEffect, useState } from "react";
import "./App.css";
import {
  Car,
  CalendarDays,
  Gauge,
  Plus,
  Wrench,
  Pencil,
  Trash2,
  X,
  Save,
  CircleGauge,
} from "lucide-react";

function App() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [editingMaintenanceId, setEditingMaintenanceId] = useState(null);

  const [editingVehicleId, setEditingVehicleId] = useState(null);

  const [vehicleEditData, setVehicleEditData] = useState({
    make: "",
    model: "",
    year: "",
    vin: "",
  });

  const [maintenanceEditData, setMaintenanceEditData] = useState({
    description: "",
    date: "",
    mileage: "",
  });

  const [formData, setFormData] = useState({
    // Add form state....remember what the user has typed into each input
    make: "",
    model: "",
    year: "",
    vin: "",
  });

  const [maintenanceFormData, setMaintenanceFormData] = useState({
    // form state for maintenance records
    description: "",
    date: "",
    mileage: "",
  });

  useEffect(() => {
    fetch("http://localhost:5002/api/vehicles")
      .then((response) => response.json())
      .then((data) => setVehicles(data))
      .catch((error) => console.error("Error fetching vehicles:", error));
  }, []);

  useEffect(() => {
    if (!selectedVehicle) {
      return;
    }

    fetch(
      `http://localhost:5002/api/MaintenanceRecords/vehicle/${selectedVehicle.id}`
    )
      .then((response) => response.json())
      .then((data) => setMaintenanceRecords(data))
      .catch((error) =>
        console.error("Error fetching maintenance records:", error)
      );
  }, [selectedVehicle]);

  const handleChange = (event) => {
    // Add the change handler
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleMaintenanceChange = (event) => {
    // handler for maintenance
    setMaintenanceFormData({
      ...maintenanceFormData,
      [event.target.name]: event.target.value,
    });
  };

  const handleEditVehicle = (vehicle) => {
    setEditingVehicleId(vehicle.id);

    setVehicleEditData({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      vin: vehicle.vin || "",
    });
  };

  const handleVehicleEditChange = (event) => {
    setVehicleEditData({
      ...vehicleEditData,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdateVehicle = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5002/api/vehicles/${editingVehicleId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            make: vehicleEditData.make,
            model: vehicleEditData.model,
            year: Number(vehicleEditData.year),
            vin: vehicleEditData.vin,
          }),
        }
      );

      if (!response.ok) {
        console.error("Failed to update vehicle");
        return;
      }

      const updatedVehicle = await response.json();

      setVehicles(
        vehicles.map((vehicle) =>
          vehicle.id === editingVehicleId
            ? updatedVehicle
            : vehicle
        )
      );

      if (selectedVehicle?.id === editingVehicleId) {
        setSelectedVehicle(updatedVehicle);
      }

      setEditingVehicleId(null);

      setVehicleEditData({
        make: "",
        model: "",
        year: "",
        vin: "",
      });
    } catch (error) {
      console.error("Error updating vehicle:", error);
    }
  };

  const handleDeleteVehicle = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vehicle?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5002/api/vehicles/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        console.error("Failed to delete vehicle");
        return;
      }

      setVehicles(
        vehicles.filter((vehicle) => vehicle.id !== id)
      );

      if (selectedVehicle?.id === id) {
        setSelectedVehicle(null);
        setMaintenanceRecords([]);
      }

      if (editingVehicleId === id) {
        setEditingVehicleId(null);

        setVehicleEditData({
          make: "",
          model: "",
          year: "",
          vin: "",
        });
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  const handleEditMaintenance = (record) => {
    setEditingMaintenanceId(record.id);

    setMaintenanceEditData({
      description: record.description,
      date: record.date,
      mileage: record.mileage,
    });
  };

  const handleMaintenanceEditChange = (event) => {
    setMaintenanceEditData({
      ...maintenanceEditData,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdateMaintenance = async (event) => {
    event.preventDefault();

    const response = await fetch(
      `http://localhost:5002/api/MaintenanceRecords/${editingMaintenanceId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          vehicleId: selectedVehicle.id,
          description: maintenanceEditData.description,
          date: maintenanceEditData.date,
          mileage: Number(maintenanceEditData.mileage),
        }),
      }
    );

    if (!response.ok) {
      console.error("Failed to update maintenance record");
      return;
    }

    setMaintenanceRecords(
      maintenanceRecords.map((record) =>
        record.id === editingMaintenanceId
          ? {
              ...record,
              vehicleId: selectedVehicle.id,
              description: maintenanceEditData.description,
              date: maintenanceEditData.date,
              mileage: Number(maintenanceEditData.mileage),
            }
          : record
      )
    );

    setEditingMaintenanceId(null);

    setMaintenanceEditData({
      description: "",
      date: "",
      mileage: "",
    });
  };

  const handleDeleteMaintenance = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this maintenance record?"
    );

    if (!confirmed) {
      return;
    }

    const response = await fetch(
      `http://localhost:5002/api/MaintenanceRecords/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      console.error("Failed to delete maintenance record");
      return;
    }

    setMaintenanceRecords(
      maintenanceRecords.filter((record) => record.id !== id)
    );
  };

  const handleSubmit = async (event) => {
    // submit handler
    event.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5002/api/vehicles",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            make: formData.make,
            model: formData.model,
            year: Number(formData.year),
            vin: formData.vin,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create vehicle");
      }

      const newVehicle = await response.json();

      setVehicles([...vehicles, newVehicle]);

      setFormData({
        make: "",
        model: "",
        year: "",
        vin: "",
      });
    } catch (error) {
      console.error("Error creating vehicle:", error);
    }
  };

  const handleMaintenanceSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch(
      "http://localhost:5002/api/MaintenanceRecords",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vehicleId: selectedVehicle.id,
          description: maintenanceFormData.description,
          date: maintenanceFormData.date,
          mileage: Number(maintenanceFormData.mileage),
        }),
      }
    );

    if (!response.ok) {
      console.error("Failed to add maintenance record");
      return;
    }

    const newRecord = await response.json();

    setMaintenanceRecords([...maintenanceRecords, newRecord]);

    setMaintenanceFormData({
      description: "",
      date: "",
      mileage: "",
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-slate-900 text-white">
              <Car size={24} strokeWidth={2} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                FleetTrack
              </h1>

              <p className="text-sm text-slate-500 mt-0.5">
                Vehicle Fleet Management
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Fleet Overview */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <CircleGauge size={20} className="text-slate-500" />

            <h2 className="text-xl font-semibold">
              Fleet Overview
            </h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100">
                <Car size={25} className="text-slate-700" />
              </div>

              <div>
                <p className="text-3xl font-bold">
                  {vehicles.length}
                </p>

                <p className="text-sm text-slate-500">
                  Vehicles in your fleet
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Add Vehicle */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-10">
          <div className="flex items-center gap-2 mb-5">
            <Plus size={20} className="text-slate-500" />

            <h2 className="text-xl font-semibold">
              Add Vehicle
            </h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
              type="text"
              name="make"
              placeholder="Make"
              value={formData.make}
              onChange={handleChange}
            />

            <input
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
              type="text"
              name="model"
              placeholder="Model"
              value={formData.model}
              onChange={handleChange}
            />

            <input
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
              type="number"
              name="year"
              placeholder="Year"
              value={formData.year}
              onChange={handleChange}
            />

            <input
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
              type="text"
              name="vin"
              placeholder="VIN"
              value={formData.vin}
              onChange={handleChange}
            />

            <button
              type="submit"
              className="md:col-span-2 justify-self-start inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white font-medium cursor-pointer hover:bg-slate-700 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 shadow-sm"
            >
              <Plus size={18} />
              Add Vehicle
            </button>
          </form>
        </section>

        {/* Vehicles */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Car size={20} className="text-slate-500" />

            <h2 className="text-xl font-semibold">
              Vehicles
            </h2>
          </div>

          {vehicles.length === 0 ? (
            <p className="text-slate-500 bg-white border border-dashed border-slate-300 rounded-xl p-6 text-center">
              No vehicles found.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                // vehicle card
                <div
                  className={`bg-white border rounded-2xl p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                    selectedVehicle?.id === vehicle.id
                      ? "border-slate-800 shadow-md ring-1 ring-slate-800"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  key={vehicle.id}
                  onClick={() =>
                    setSelectedVehicle(
                      selectedVehicle?.id === vehicle.id
                        ? null
                        : vehicle
                    )
                  }
                >
                  {editingVehicleId === vehicle.id ? (
                    <form
                      onSubmit={handleUpdateVehicle}
                      onClick={(event) => event.stopPropagation()}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                          Edit Vehicle
                        </h3>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingVehicleId(null);

                            setVehicleEditData({
                              make: "",
                              model: "",
                              year: "",
                              vin: "",
                            });
                          }}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600 cursor-pointer hover:bg-slate-200 transition"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <input
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
                        type="text"
                        name="make"
                        placeholder="Make"
                        value={vehicleEditData.make}
                        onChange={handleVehicleEditChange}
                      />

                      <input
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
                        type="text"
                        name="model"
                        placeholder="Model"
                        value={vehicleEditData.model}
                        onChange={handleVehicleEditChange}
                      />

                      <input
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
                        type="number"
                        name="year"
                        placeholder="Year"
                        value={vehicleEditData.year}
                        onChange={handleVehicleEditChange}
                      />

                      <input
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
                        type="text"
                        name="vin"
                        placeholder="VIN"
                        value={vehicleEditData.vin}
                        onChange={handleVehicleEditChange}
                      />

                      <button
                        type="submit"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium cursor-pointer hover:bg-emerald-700 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200"
                      >
                        <Save size={16} />
                        Save Changes
                      </button>
                    </form>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-slate-100">
                          <Car size={23} className="text-slate-700" />
                        </div>

                        <span className="text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full">
                          {vehicle.year}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold mb-3">
                        {vehicle.make} {vehicle.model}
                      </h3>

                      <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <CalendarDays
                            size={16}
                            className="text-slate-400"
                          />

                          <span>{vehicle.year}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Gauge
                            size={16}
                            className="text-slate-400"
                          />

                          <span className="truncate">
                            VIN: {vehicle.vin || "N/A"}
                          </span>
                        </div>
                      </div>

                      <div
                        className="flex items-center gap-2 mt-5"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            handleEditVehicle(vehicle)
                          }
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium cursor-pointer hover:bg-slate-700 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200"
                        >
                          <Pencil size={15} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteVehicle(vehicle.id)
                          }
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium cursor-pointer hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {selectedVehicle && (
          // vehicle details
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Car size={20} className="text-slate-500" />

                <h2 className="text-xl font-semibold">
                  Vehicle Details
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedVehicle(null)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 text-slate-600 text-sm font-medium cursor-pointer hover:bg-slate-200 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200"
              >
                <X size={16} />
                Close
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8">
              <h3 className="text-2xl font-bold mb-3">
                {selectedVehicle.make} {selectedVehicle.model}
              </h3>

              <div className="flex flex-col sm:flex-row gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <CalendarDays
                    size={17}
                    className="text-slate-400"
                  />

                  <span>
                    Year: {selectedVehicle.year}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Gauge
                    size={17}
                    className="text-slate-400"
                  />

                  <span>
                    VIN: {selectedVehicle.vin || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-5">
              <Wrench size={20} className="text-slate-500" />

              <h3 className="text-lg font-semibold">
                Add Maintenance Record
              </h3>
            </div>

            <form
              onSubmit={handleMaintenanceSubmit}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <input
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
                type="text"
                name="description"
                placeholder="Description"
                value={maintenanceFormData.description}
                onChange={handleMaintenanceChange}
              />

              <input
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
                type="date"
                name="date"
                value={maintenanceFormData.date}
                onChange={handleMaintenanceChange}
              />

              <input
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
                type="number"
                name="mileage"
                placeholder="Mileage"
                value={maintenanceFormData.mileage}
                onChange={handleMaintenanceChange}
              />

              <button
                type="submit"
                className="md:col-span-3 justify-self-start inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white font-medium cursor-pointer hover:bg-slate-700 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 shadow-sm"
              >
                <Plus size={18} />
                Add Maintenance
              </button>
            </form>

            <div className="flex items-center gap-2 mt-10 mb-5">
              <Wrench size={20} className="text-slate-500" />

              <h3 className="text-lg font-semibold">
                Maintenance History
              </h3>
            </div>

            {maintenanceRecords.length === 0 ? (
              <p className="text-slate-500 bg-slate-50 border border-dashed border-slate-300 rounded-xl p-6 text-center">
                No maintenance records found.
              </p>
            ) : (
              <div className="space-y-4">
                {maintenanceRecords.map((record) => (
                  // maintenance card
                  <div
                    className="border border-slate-200 rounded-xl p-5 bg-slate-50 transition hover:border-slate-300 hover:shadow-sm"
                    key={record.id}
                  >
                    {editingMaintenanceId === record.id ? (
                      <form
                        onSubmit={handleUpdateMaintenance}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                      >
                        <input
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
                          type="text"
                          name="description"
                          value={maintenanceEditData.description}
                          onChange={handleMaintenanceEditChange}
                        />

                        <input
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
                          type="date"
                          name="date"
                          value={maintenanceEditData.date}
                          onChange={handleMaintenanceEditChange}
                        />

                        <input
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
                          type="number"
                          name="mileage"
                          value={maintenanceEditData.mileage}
                          onChange={handleMaintenanceEditChange}
                        />

                        <div className="md:col-span-3 flex items-center gap-2">
                          <button
                            type="submit"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium cursor-pointer hover:bg-emerald-700 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200"
                          >
                            <Save size={16} />
                            Save
                          </button>

                          <button
                            type="button"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-200 text-slate-700 text-sm font-medium cursor-pointer hover:bg-slate-300 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200"
                            onClick={() => {
                              setEditingMaintenanceId(null);

                              setMaintenanceEditData({
                                description: "",
                                date: "",
                                mileage: "",
                              });
                            }}
                          >
                            <X size={16} />
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="mb-5">
                          <div className="flex items-center gap-2 mb-3">
                            <Wrench
                              size={18}
                              className="text-slate-500"
                            />

                            <p className="font-semibold">
                              {record.description}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                              <CalendarDays
                                size={16}
                                className="text-slate-400"
                              />

                              <span>{record.date}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Gauge
                                size={16}
                                className="text-slate-400"
                              />

                              <span>{record.mileage} km</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleEditMaintenance(record)
                            }
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium cursor-pointer hover:bg-slate-700 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200"
                          >
                            <Pencil size={15} />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteMaintenance(record.id)
                            }
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium cursor-pointer hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200"
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;