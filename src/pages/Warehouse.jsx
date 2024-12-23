import { useEffect, useState, useRef } from "react";
import styles from "./State.module.css";
import food from "../assets/images/food.png";
import { handleError, handleSuccess } from "../Utils";
import { ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { CiSearch } from "react-icons/ci";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function Warehouse() {
  const [tableData, setTableData] = useState();
  const [modal, setModal] = useState(false);
  const [submit, changeSubmit] = useState(true);
  const [id, setId] = useState(-1);
  const [state, setState] = useState();
  const [city, setCity] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  async function fetchWarehouseData() {
    const headers = {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    };
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/warehouse`, headers);
    const result = await response.json();
    setTableData(result.data);
    result.data;
  }
  useEffect(() => {
    fetchWarehouseData();
    fetchActiveStateData();
    fetchActiveCityData();
  }, []);

  async function fetchActiveStateData() {
    const headers = {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    };
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/state/active`, headers);
    const data = await response.json();
    const result = data.data;
    setState(result);
  }

  async function fetchActiveCityData() {
    const headers = {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    };
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/city/active`, headers);
    const data = await response.json();
    const result = data.data;
    setCity(result);
  }

  const [formData, setFormData] = useState({
    warehouse_name: "",
    city_id: "",
    state_id: "",
    status: "Active",
  });

  function handleChange(event) {
    setFormData((prevState) => {
      return { ...prevState, [event.target.id]: event.target.value };
    });
  }

  function handleSearchChange(event) {
    setSearchQuery(event.target.value);
  }

  async function saveData(formData) {
    try {
      const url = `${import.meta.env.VITE_BASE_URL}/warehouse/addWarehouse`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      const result = data;
      const { status, message } = result;
      if (status == true) {
        fetchWarehouseData();
        handleSuccess(message);
        setModal(false);
        setFormData({
          warehouse_name: "",
          city_id: "",
          state_id: "",
          status: "Active",
        });
      } else {
        handleError(message);
      }
    } catch (error) {
      handleError(error);
    }
  }

  async function updateData(id, formData) {
    try {
      const url = `${
        import.meta.env.VITE_BASE_URL
      }/warehouse/updateWarehouse/${id}`;
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      const result = data;
      const { status, message } = result;
      if (status == true) {
        fetchWarehouseData();
        changeSubmit(true);
        handleSuccess(message);
        setModal(false);
        setFormData({
          warehouse_name: "",
          city_id: "",
          state_id: "",
          status: "Active",
        });
      } else {
        handleError(message);
      }
    } catch (error) {
      handleError(error);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    saveData(formData);
  }

  function handleUpdate(event) {
    event.preventDefault();
    updateData(id, formData);
  }

  let modelStyle = {
    display: "block",
    backgroundColor: "rgba(0,0,0,0.8)",
  };

  function editWarehouse(event) {
    setId(event._id);
    setModal(true);
    setFormData((prevState) => {
      return {
        ...prevState,
        warehouse_name: event.warehouse_name,
        city_id: event.city_id._id,
        state_id: event.state_id._id,
        status: event.status,
      };
    });

    changeSubmit(false);
  }

  async function deleteWarehouseData(id) {
    try {
      const url = `${
        import.meta.env.VITE_BASE_URL
      }/warehouse/deleteWarehouse/${id}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      const result = data;
      const { status, message } = result;
      if (status == true) {
        fetchWarehouseData();
        changeSubmit(true);
        handleSuccess(message);
        setModal(false);
        setFormData({
          warehouse_name: "",
          city_id: "",
          state_id: "",
          status: "Active",
        });
      } else {
        handleError(message);
      }
    } catch (error) {
      handleError(error);
    }
  }

  async function deleteWarehouse(event) {
    Swal.fire({
      title: "Delete",
      text: "Are you sure you want to delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteWarehouseData(event._id);
      }
    });
  }

  // Filter table data based on the search query
  const filteredData =
    tableData &&
    tableData.filter(
      (item) =>
        item.warehouse_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.city_id.city_name.toLowerCase().includes(searchQuery.toLowerCase())||
        item.state_id.state_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className={styles.stateContainer}>
      <div className={styles.stateHeader}>
        <div className="row d-flex align-items-center">
          <div className="col-2 d-flex align-items-center justify-content-start">
            <img src={food} alt="" className="me-2" />
            <span className="h5 m-0">Warehouse</span>
          </div>
          <div className="col-6 position-relative">
            <CiSearch
              className="position-absolute"
              style={{ top: "10px", left: "20px" }}
            />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: "30px" }}
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by Warehouse Name or city or state"
            />
          </div>
          <div className="col-4 d-flex justify-content-end">
            <button
              type="button"
              className={styles.addNewBtn}
              onClick={() => {
                setModal(true);
                changeSubmit(true);
                setFormData({
                  warehouse_name: "",
                  city_id: "",
                  state_id: "",
                  status: "Active",
                });
              }}
            >
              Add New
            </button>
            {modal ? (
              <div className="modal show fade" style={modelStyle}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1 className="modal-title fs-5" id="exampleModalLabel">
                        Add Warehouse
                      </h1>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={() => setModal(false)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <form onSubmit={submit ? handleSubmit : handleUpdate}>
                        <div className="mb-3">
                          <label
                            htmlFor="warehouse_name"
                            className="form-label"
                          >
                            Warehouse Name<span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="warehouse_name"
                            name="warehouse_name"
                            value={formData.warehouse_name}
                            onChange={handleChange}
                            required={true}
                            placeholder="Enter Warehouse"
                          />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="state_id">
                            State<span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select"
                            id="state_id"
                            name="state_id"
                            value={formData.state_id}
                            onChange={handleChange}
                            required={true}
                          >
                            <option value="">---Select---</option>
                            {state &&
                              state.map((item) => {
                                return (
                                  <option value={item._id} key={item._id}>
                                    {item.state_name}
                                  </option>
                                );
                              })}
                          </select>
                        </div>

                        <div className="mb-3">
                          <label htmlFor="city_id">
                            City<span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select"
                            id="city_id"
                            name="city_id"
                            value={formData.city_id}
                            onChange={handleChange}
                            required={true}
                          >
                            <option value="">---Select---</option>
                            {city &&
                              city.map((item) => {
                                return (
                                  <option value={item._id} key={item._id}>
                                    {item.city_name}
                                  </option>
                                );
                              })}
                          </select>
                        </div>

                        <div className="mb-3">
                          <label htmlFor="status">
                            Status<span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select"
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                        <div  className="d-flex justify-content-end mt-4">
                          <button
                            type="button"
                            className="btn btn-secondary me-2"
                            data-bs-dismiss="modal"
                            onClick={() => setModal(false)}
                          >
                            Close
                          </button>
                          {submit ? (
                            <button type="submit" className="btn btn-primary">
                              Save
                            </button>
                          ) : (
                            <button type="submit" className="btn btn-primary">
                              Update
                            </button>
                          )}
                        </div>
                      </form>
                    </div>
                    <div className="modal-footer"></div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <table className="table striped bordered w-100">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>state</th>
              <th>city</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData &&
              filteredData.map((item) => {
                console.log("item......", item);
                return (
                  <tr key={item?._id}>
                    <td>{item?.warehouse_name}</td>
                    <td>{item?.city_id?.city_name}</td>
                    <td>{item?.state_id?.state_name}</td>
                    <td
                      style={{
                        color: item?.status === "Active" ? "green" : "red",
                      }}
                    >
                      {item?.status}
                    </td>
                    <td>
                      <FaEdit
                        onClick={() => editWarehouse(item)}
                        style={{
                          cursor: "pointer",
                          width: "20px",
                          height: "20px",
                          color: "8f8f8f",
                        }}
                      />{" "}
                      |
                      <MdDelete
                        onClick={() => deleteWarehouse(item)}
                        style={{
                          cursor: "pointer",
                          width: "30px",
                          height: "20px",
                          color: "8f8f8f",
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Warehouse;
