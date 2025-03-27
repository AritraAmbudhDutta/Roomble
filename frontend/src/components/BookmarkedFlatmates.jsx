import React, { useEffect, useState, useContext } from "react";
import FlatmateCard from "../components/FlatmateCard.jsx";
import "../css/BookmarkedFlatmates.css";
import { Basecontext } from "../context/base/Basecontext";
import { toast } from "react-toastify";
import PropertyCardTenant from "./FindPropertyComponents/PropertyCardTenant.jsx";
import config from "../config";

// Import from the maintained fork of react-beautiful-dnd
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Swal from "sweetalert2";

const BookmarkedFlatmates = () => {
  const [showFlatmates, setShowFlatmates] = useState(true);
  const [flatmates, setFlatmates] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(Basecontext);
  const [somethingwentwrong, setSomethingwentwrong] = useState(false);

  useEffect(() => {
    if (somethingwentwrong) {
      toast.error("Something went wrong. Please try again later.");
      navigate(-1);
    }
  }, [somethingwentwrong]);

  useEffect(() => {
    const fetchBookmarkedData = async () => {
      const token = localStorage.getItem("authtoken");
      try {
        toast.success("Fetching Data");
        const response = await fetch(
          `${config.backend}/api/BookMarking_Routes/get_bookmarks`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authtoken: token,
            },
          }
        );
        const data = await response.json();
        if (!data.success) {
          toast.error(data.message);
          return;
        }
        setFlatmates(data.FlatmateBookMarks);
        setProperties(data.PropertyBookMarks);
      } catch (err) {
        setError(err.message);
        setSomethingwentwrong(true);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarkedData();
  }, []);

  if (loading)
    return <div className="bookmarked-page">Loading bookmarks...</div>;
  if (error) return <div className="bookmarked-page">Error: {error}</div>;

  // Function to call the backend for deletion.
  // 'thing' can be "flatmate" or "property".
  const handleDelete = async (bookmarkId, thing) => {
    const token = localStorage.getItem("authtoken");
    console.log("Calling backend delete for:", bookmarkId, thing);
    try {
      const response = await fetch(
        `${config.backend}/api/BookMarking_Routes/edit_bookmarks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authtoken: token,
          },
          body: JSON.stringify({
            action: "unmark",
            thing: thing,
            id: bookmarkId,
          }),
        }
      );
      const data = await response.json();
      console.log("Backend response:", data);
      if (data.success) {
        toast.success(data.message);
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      toast.error("Failed to remove bookmark");
      console.error("Deletion error:", error);
      return false;
    }
  };

  // Confirmation popup when clicking the bookmark icon (or delete button)
  const handleBookmarkClick = async (bookmarkId, thing) => {
    const confirmPopup = await Swal.fire({
      title: "Remove Bookmark?",
      text: "Are you sure you want to remove this bookmark?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "Cancel",
    });
    if (confirmPopup.isConfirmed) {
      const success = await handleDelete(bookmarkId, thing);
      if (success) {
        if (thing === "flatmate") {
          setFlatmates((prev) =>
            prev.filter((item) => item._id !== bookmarkId)
          );
        } else if (thing === "property") {
          setProperties((prev) =>
            prev.filter((item) => item._id !== bookmarkId)
          );
        }
      }
    }
  };

  // Drag handler for flatmates view
  const handleFlatmatesDragEnd = async (result) => {
    if (!result.destination) return;
    const { destination, draggableId } = result;
    if (destination.droppableId === "delete-zone") {
      const confirmDelete = await Swal.fire({
        title: "Remove Bookmark?",
        text: "Are you sure you want to delete this bookmark?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, remove it!",
        cancelButtonText: "Cancel",
      });
      if (confirmDelete.isConfirmed) {
        const index = flatmates.findIndex((item) => item._id === draggableId);
        if (index !== -1) {
          const removedItem = flatmates[index];
          const updatedFlatmates = [...flatmates];
          updatedFlatmates.splice(index, 1);
          const success = await handleDelete(removedItem._id, "flatmate");
          if (success) {
            setFlatmates(updatedFlatmates);
          }
        }
      }
    }
  };

  // Drag handler for properties view
  const handlePropertiesDragEnd = async (result) => {
    if (!result.destination) return;
    const { destination, draggableId } = result;
    if (destination.droppableId === "delete-zone") {
      const confirmDelete = await Swal.fire({
        title: "Remove Bookmark?",
        text: "Are you sure you want to delete this bookmark?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, remove it!",
        cancelButtonText: "Cancel",
      });
      if (confirmDelete.isConfirmed) {
        const index = properties.findIndex((item) => item._id === draggableId);
        if (index !== -1) {
          const removedItem = properties[index];
          const updatedProperties = [...properties];
          updatedProperties.splice(index, 1);
          const success = await handleDelete(removedItem._id, "property");
          if (success) {
            setProperties(updatedProperties);
          }
        }
      }
    }
  };

  // Toggle between flatmates and properties
  const togglePage = () => {
    setShowFlatmates((prev) => !prev);
  };

  return (
    <div className="bookmarked-page">
      <button className="toggle-button" onClick={togglePage}>
        {showFlatmates
          ? "Switch to Bookmarked Properties"
          : "Switch to Bookmarked Flatmates"}
      </button>
      {/* Using a unique key forces remounting for the flip animation */}
      <div
        key={showFlatmates ? "flatmates" : "properties"}
        className="page-container"
      >
        {showFlatmates ? (
          <div className="page-content animate-flip">
            <DragDropContext onDragEnd={handleFlatmatesDragEnd}>
              <Droppable droppableId="delete-zone">
                {(provided, snapshot) => (
                  <div
                    className="delete-zone"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <img
                      src="/delete-icon.png"
                      alt="Delete"
                      className={`trash-icon ${
                        snapshot.isDraggingOver ? "trash-active" : ""
                      }`}
                    />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <h1 className="page-title">Your Bookmarked Flatmates</h1>
              <Droppable droppableId="flatmates">
                {(provided) => (
                  <div
                    className="flatmates-grid"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {flatmates.map((flatmate, index) => (
                      <Draggable
                        key={flatmate._id}
                        draggableId={flatmate._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className="draggable-card"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <FlatmateCard
                              id={flatmate._id}
                              name={flatmate.name}
                              locality={flatmate.locality}
                              city={flatmate.city || "Mumbai"}
                              gender={flatmate.gender}
                              image={flatmate.Images}
                              compatibilityScore={flatmate.score}
                              isBookmarked={true}
                              onBookmarkToggle={() =>
                                handleBookmarkClick(flatmate._id, "flatmate")
                              }
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        ) : (
          <div className="page-content animate-flip">
            <DragDropContext onDragEnd={handlePropertiesDragEnd}>
              <Droppable droppableId="delete-zone">
                {(provided, snapshot) => (
                  <div
                    className="delete-zone"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <img
                      src="/delete-icon.png"
                      alt="Delete"
                      className={`trash-icon ${
                        snapshot.isDraggingOver ? "trash-active" : ""
                      }`}
                    />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <h1 className="page-title">Your Bookmarked Properties</h1>
              <Droppable droppableId="properties">
                {(provided) => (
                  <div
                    className="flatmates-grid"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {properties.length === 0 ? (
                      <p>No properties bookmarked yet.</p>
                    ) : (
                      properties.map((property, index) => (
                        <Draggable
                          key={property._id}
                          draggableId={property._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              className="draggable-card"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <PropertyCardTenant
                                id={property._id}
                                image={property.Images[0]}
                                price={property.price}
                                title={property.name}
                                location={`${property.address}`}
                                bhk={property.bhk}
                                available={property.available}
                                onView={() =>
                                  console.log("Viewing:", property.name)
                                }
                                onDelete={() =>
                                  handleBookmarkClick(property._id, "property")
                                }
                              />
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarkedFlatmates;
