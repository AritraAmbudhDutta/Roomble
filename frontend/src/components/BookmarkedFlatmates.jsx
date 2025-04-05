import React, { useEffect, useState, useContext } from "react";
import FlatmateCard from "../components/FlatmateCard.jsx";
import "../css/BookmarkedFlatmates.css";
import { Basecontext } from "../context/base/Basecontext";
import { toast } from "react-toastify";
import PropertyCardTenant from "./FindPropertyComponents/PropertyCardTenant.jsx";
import config from "../config";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const BookmarkedFlatmates = () => {
  const [showFlatmates, setShowFlatmates] = useState(true);
  const [flatmates, setFlatmates] = useState([]);
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState(null);
  const { user, loading, setLoading } = useContext(Basecontext);
  const [somethingwentwrong, setSomethingwentwrong] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (somethingwentwrong) {
      toast.error("Something went wrong. Please try again later.");
      navigate(-1);
    }
  }, [somethingwentwrong, navigate]);

  useEffect(() => {
    const fetchBookmarkedData = async () => {
      const token = localStorage.getItem("authtoken");
      try {
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

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = async (result, handler) => {
    setIsDragging(false);
    await handler(result);
  };

  const handleDelete = async (bookmarkId, thing) => {
    const token = localStorage.getItem("authtoken");
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
          setFlatmates((prev) => prev.filter((item) => item._id !== bookmarkId));
        } else if (thing === "property") {
          setProperties((prev) => prev.filter((item) => item._id !== bookmarkId));
        }
      }
    }
  };

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
          if (success) setFlatmates(updatedFlatmates);
        }
      }
    }
  };

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
          if (success) setProperties(updatedProperties);
        }
      }
    }
  };

  const handleTabClick = (isFlatmatesTab) => {
    setShowFlatmates(isFlatmatesTab);
  };

  if (loading)
    return <div className="tenant-dashboard-bookmarked-page">Loading bookmarks...</div>;
  if (error)
    return <div className="tenant-dashboard-bookmarked-page">Error: {error}</div>;

  return (
    <div className="tenant-dashboard-bookmarked-page">
      <div className="tenant-dashboard-tabs">
        <button
          className={`tenant-dashboard-tab-button ${
            showFlatmates ? "tenant-dashboard-active-tab" : ""
          }`}
          onClick={() => handleTabClick(true)}
        >
          Bookmarked Flatmates
        </button>
        <button
          className={`tenant-dashboard-tab-button ${
            !showFlatmates ? "tenant-dashboard-active-tab" : ""
          }`}
          onClick={() => handleTabClick(false)}
        >
          Bookmarked Properties
        </button>
      </div>

      <div key={showFlatmates ? "flatmates" : "properties"} className="tenant-dashboard-page-container">
        <div className="tenant-dashboard-page-content animate-flip">
          <DragDropContext
            onDragStart={handleDragStart}
            onDragEnd={(result) =>
              handleDragEnd(result, showFlatmates ? handleFlatmatesDragEnd : handlePropertiesDragEnd)
            }
          >
            <Droppable droppableId="delete-zone">
              {(provided, snapshot) => (
                <div
                  className={`tenant-dashboard-delete-zone ${
                    isDragging ? "visible" : "hidden"
                  }`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <img
                    src="/delete-icon.png"
                    alt="Delete"
                    className={`tenant-dashboard-trash-icon ${
                      snapshot.isDraggingOver ? "trash-active" : ""
                    }`}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <h1 className="tenant-dashboard-page-title">
              Your Bookmarked {showFlatmates ? "Flatmates" : "Properties"}
            </h1>

            {showFlatmates && flatmates.length === 0 ? (
              <div className="tenant-dashboard-empty-message">
                <img src="./people_when_page_empty.png" alt="No bookmarks" />
                <h3>No Bookmarked Flatmates Yet</h3>
              </div>
            ) : !showFlatmates && properties.length === 0 ? (
              <div className="tenant-dashboard-empty-message">
                <img src="./house_when_page_empty.png" alt="No bookmarks" />
                <h3>No Bookmarked Properties Yet</h3>
              </div>
            ) : (
              <Droppable droppableId={showFlatmates ? "flatmates" : "properties"}>
                {(provided) => (
                  <div
                    className="tenant-dashboard-flatmates-grid"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {(showFlatmates ? flatmates : properties).map((item, index) => (
                      <Draggable key={item._id} draggableId={item._id} index={index}>
                        {(provided) => (
                          <div
                            className="tenant-dashboard-draggable-card"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {showFlatmates ? (
                              <FlatmateCard
                                id={item._id}
                                name={item.name}
                                locality={item.locality}
                                city={item.city || "Mumbai"}
                                gender={item.gender}
                                image={item.Images}
                                compatibilityScore={item.score}
                                isBookmarked={true}
                                onBookmarkToggle={() =>
                                  handleBookmarkClick(item._id, "flatmate")
                                }
                                help={true}
                              />
                            ) : (
                              <PropertyCardTenant
                                id={item._id}
                                image={item.Images[0]}
                                price={item.price}
                                title={item.name}
                                location={item.address}
                                bhk={item.bhk}
                                available={item.available}
                                onView={() => {}}
                                onDelete={() => handleBookmarkClick(item._id, "property")}
                              />
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            )}
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

export default BookmarkedFlatmates;
