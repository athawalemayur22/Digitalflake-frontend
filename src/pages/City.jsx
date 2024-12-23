import { useEffect, useState, useRef } from "react";
import styles from "./State.module.css";
import skyline from "../assets/images/skyline.png";
import { handleError, handleSuccess } from "../Utils";
import { ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { CiSearch } from "react-icons/ci";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function City() {
  const [tableData, setTableData] = useState();
  const [modal, setModal] = useState(false);
  const [submit, changeSubmit] = useState(true);
  const [id, setId] = useState(-1);
  const [state, setState] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  async function fetchCityData() {
    const headers = {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    };
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/city`, headers);
    const result = await response.json();
    setTableData(result.data);
    result.data;
  }
  useEffect(() => {
    fetchCityData();
    fetchActiveStateData();
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

  const [formData, setFormData] = useState({
    city_name: "",
    city_code: "",
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
      const url = `${import.meta.env.VITE_BASE_URL}/city/addCity`;
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
        fetchCityData();
        handleSuccess(message);
        setModal(false);
        setFormData({
          city_name: "",
          city_code: "",
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
    console.log("formdata...", formData);
    try {
      const url = `${import.meta.env.VITE_BASE_URL}/city/updateCity/${id}`;
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
        fetchCityData();
        changeSubmit(true);
        handleSuccess(message);
        setModal(false);
        setFormData({
          city_name: "",
          city_code: "",
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

  function editCity(event) {
    console.log("event data..", event);
    setId(event._id);
    setModal(true);
    setFormData((prevState) => {
      return {
        ...prevState,
        city_name: event.city_name,
        city_code: event.city_code,
        state_id: event.state_id._id,
        status: event.status,
      };
    });

    changeSubmit(false);
  }

  async function deleteCityData(id) {
    try {
      const url = `${import.meta.env.VITE_BASE_URL}/city/deleteCity/${id}`;
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
        fetchCityData();
        changeSubmit(true);
        handleSuccess(message);
        setModal(false);
        setFormData({
          city_name: "",
          city_code: "",
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

  async function deleteCity(event) {
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
        deleteCityData(event._id);
      }
    });
  }

  // Filter table data based on the search query
  const filteredData =
    tableData &&
    tableData.filter(
      (item) =>
        item.city_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.city_code.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className={styles.stateContainer}>
      <div className={styles.stateHeader}>
        <div className="row d-flex align-items-center">
          <div className="col-2 d-flex align-items-center justify-content-start">
            <img src={skyline} alt="" className="me-2" />
            <span className="h5 m-0">City</span>
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
              placeholder="Search by City Name or Code"
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
                  city_name: "",
                  city_code: "",
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
                        Add City
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
                          <label htmlFor="city_name" className="form-label">
                            City Name<span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="city_name"
                            name="city_name"
                            value={formData.city_name}
                            onChange={handleChange}
                            required={true}
                            placeholder="Enter City Name"
                          />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="city_code" className="form-label">
                            City Code<span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="city_code"
                            name="city_code"
                            value={formData.city_code}
                            onChange={handleChange}
                            required={true}
                            placeholder="Enter City Code"
                          />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="status">
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
                        <div className="d-flex justify-content-end mt-4">
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
              <th>City Name</th>
              <th>City Code</th>
              <th>State Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData &&
              filteredData.map((item) => {
                return (
                  <tr key={item._id}>
                    <td>{item?.city_name}</td>
                    <td>{item?.city_code}</td>
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
                        onClick={() => editCity(item)}
                        style={{
                          cursor: "pointer",
                          width: "20px",
                          height: "20px",
                          color: "8f8f8f",
                        }}
                      />{" "}
                      |
                      <MdDelete
                        onClick={() => deleteCity(item)}
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

export default City;
