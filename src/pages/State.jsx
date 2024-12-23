import { useEffect, useState, useRef } from "react";
import styles from "./State.module.css";
import map from "../assets/images/map.png";
import { handleError, handleSuccess } from "../Utils";
import { ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { CiSearch } from "react-icons/ci";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function State() {
  const [tableData, setTableData] = useState();
  const [modal, setModal] = useState(false);
  const [submit, changeSubmit] = useState(true);
  const [id, setId] = useState(-1);
  const [searchQuery, setSearchQuery] = useState("");

  async function fetchStateData() {
    const headers = {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    };
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/state`, headers);
    const result = await response.json();
    setTableData(result.data);
    result.data;
  }
  useEffect(() => {
    fetchStateData();
  }, []);

  const [formData, setFormData] = useState({
    state_name: "",
    state_code: "",
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
      const url = `${import.meta.env.VITE_BASE_URL}/state/addState`;
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
        fetchStateData();
        handleSuccess(message);
        setModal(false);
        setFormData({
          state_name: "",
          state_code: "",
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
      const url = `${import.meta.env.VITE_BASE_URL}/state/updateState/${id}`;
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
        fetchStateData();
        changeSubmit(true);
        handleSuccess(message);
        setModal(false);
        setFormData({
          state_name: "",
          state_code: "",
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

  function editState(event) {
    setId(event._id);
    setModal(true);
    setFormData((prevState) => {
      return {
        ...prevState,
        state_name: event.state_name,
        state_code: event.state_code,
        status: event.status,
      };
    });

    changeSubmit(false);
  }

  async function deletestateData(id) {
    try {
      const url = `${import.meta.env.VITE_BASE_URL}/state/deleteState/${id}`;
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
        fetchStateData();
        changeSubmit(true);
        handleSuccess(message);
        setModal(false);
        setFormData({
          state_name: "",
          state_code: "",
          status: "Active",
        });
      } else {
        handleError(message);
      }
    } catch (error) {
      handleError(error);
    }
  }

  async function deleteState(event) {
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
        deletestateData(event._id);
      }
    });
  }

  // Filter table data based on the search query
  const filteredData =
    tableData &&
    tableData.filter(
      (item) =>
        item.state_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.state_code.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className={styles.stateContainer}>
      <div className={styles.stateHeader}>
        <div className="row d-flex align-items-center">
          <div className="col-2 d-flex align-items-center justify-content-start">
            <img src={map} alt="" className="me-2" />
            <span className="h5 m-0">State</span>
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
              placeholder="Search by State Name or Code"
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
                  state_name: "",
                  state_code: "",
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
                        Add State
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
                          <label htmlFor="state_name" className="form-label">
                            State Name<span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="state_name"
                            name="state_name"
                            value={formData.state_name}
                            onChange={handleChange}
                            required={true}
                            placeholder="Enter State Name"
                          />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="state_code" className="form-label">
                            State Code<span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="state_code"
                            name="state_code"
                            value={formData.state_code}
                            onChange={handleChange}
                            required={true}
                            placeholder="Enter State Code"
                          />
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

                        <div className="mt-4 d-flex justify-content-end">
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
              <th>State Name</th>
              <th>State Code</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData &&
              filteredData.map((item) => {
                return (
                  <tr key={item._id}>
                    <td>{item.state_name}</td>
                    <td>{item.state_code}</td>
                    <td
                      style={{
                        color: item.status === "Active" ? "green" : "red",
                      }}
                    >
                      {item.status}
                    </td>
                    <td>
                      <FaEdit
                        onClick={() => editState(item)}
                        style={{
                          cursor: "pointer",
                          width: "20px",
                          height: "20px",
                          color: "8f8f8f",
                        }}
                      />{" "}
                      |
                      <MdDelete
                        onClick={() => deleteState(item)}
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

export default State;
