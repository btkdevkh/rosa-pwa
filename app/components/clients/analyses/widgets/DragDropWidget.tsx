"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { MenuUrlPath } from "@/app/models/enums/MenuUrlPathEnum";
import reorderWidgets from "@/app/actions/widgets/reorderWidgets";
import { Widget } from "@/app/models/interfaces/Widget";
import toastSuccess from "@/app/helpers/notifications/toastSuccess";
import toastError from "@/app/helpers/notifications/toastError";

type DragDropWidgetProps = {
  widgets: Widget[] | null;
};

const DragDropWidget = ({ widgets }: DragDropWidgetProps) => {
  const router = useRouter();
  const [loading, setIsLoading] = useState(false);
  const [hasStartedDrag, setHasStartedDrag] = useState(false);

  const [items, setItems] = useState<Widget[]>(widgets ?? []);
  const draggedItemRef = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const isTouch = useRef<boolean>(false);
  const isDragging = useRef<boolean>(false);
  const parentsDiv = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleTouchMove = (event: TouchEvent) => event.preventDefault();
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => document.removeEventListener("touchmove", handleTouchMove);
  }, []);

  const startDrag = (
    index: number,
    event: React.TouchEvent | React.MouseEvent
  ) => {
    isTouch.current = "touches" in event;
    draggedItemRef.current = index;
    startY.current = isTouch.current
      ? (event as React.TouchEvent).touches[0].clientY
      : (event as React.MouseEvent).clientY;
    isDragging.current = true;
    setHasStartedDrag(true);
  };

  const moveDrag = (event: React.TouchEvent | React.MouseEvent) => {
    if (
      !isDragging.current ||
      draggedItemRef.current === null ||
      startY.current === null
    ) {
      return;
    }

    const currentY = isTouch.current
      ? (event as React.TouchEvent).touches[0].clientY
      : (event as React.MouseEvent).clientY;
    const deltaY = currentY - startY.current;

    let newIndex = draggedItemRef.current;
    if (deltaY > 30) newIndex = Math.min(newIndex + 1, items.length - 1);
    if (deltaY < -30) newIndex = Math.max(newIndex - 1, 0);

    if (newIndex !== draggedItemRef.current) {
      const updatedItems = [...items];
      const [draggedItem] = updatedItems.splice(draggedItemRef.current, 1);
      updatedItems.splice(newIndex, 0, draggedItem);

      // We reorder with the right index of each item when stop dragging
      const updatedItemsReorderedIndex = [...updatedItems].map(
        (upd_item, idx) => ({
          ...upd_item,
          params: {
            ...upd_item.params,
            index: idx + 1,
          },
        })
      );
      setItems(updatedItemsReorderedIndex);
      draggedItemRef.current = newIndex;
      startY.current = currentY;
      setHasStartedDrag(true);
    }
  };

  const endDrag = () => {
    isDragging.current = false;
    draggedItemRef.current = null;
    startY.current = null;
    setHasStartedDrag(false);
  };

  // Validate
  const handleValidate = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsLoading(true);

    // Process to DB
    const response = await reorderWidgets(items);
    setIsLoading(false);

    if (response && response.success) {
      toastSuccess(`Graphiques réordonnés`, "reorder-widgets-success");
      router.push(`${MenuUrlPath.ANALYSES}`);
    } else {
      toastError(
        `Une erreur est survenu, veuillez revenir plus tard!`,
        "reorder-widgets-failed"
      );
    }
  };

  return (
    <div
      ref={parentsDiv}
      className="flex flex-col gap-5"
      onMouseLeave={() => setHasStartedDrag(false)}
      onTouchCancel={() => setHasStartedDrag(false)}
    >
      <AnimatePresence>
        {items && items.length === 0 && (
          <div className="text-center">
            <p>Aucune donnée disponible</p>
          </div>
        )}

        {items &&
          items.length > 0 &&
          items.map((item, index) => (
            <div
              key={item.id} // Use item content as key to avoid breaking animation
              className="flex items-center gap-5"
            >
              <span>{index + 1}.</span>

              <motion.div
                className={`px-3 py-2 rounded-2xl shadow-md cursor-pointer relative flex items-center gap-2 w-full ${
                  hasStartedDrag &&
                  isDragging.current &&
                  draggedItemRef.current === index
                    ? "bg-secondary"
                    : "bg-white"
                }`}
                layout // Enables smooth animation when reordering
                whileTap={{ scale: 1 }} // Slight scale-up on press
                transition={{ type: "spring", stiffness: 500, damping: 30 }} // Smooth bounce effect
                onTouchStart={e => startDrag(index, e)}
                onTouchMove={e => moveDrag(e)}
                onTouchEnd={endDrag}
                onMouseDown={e => startDrag(index, e)}
                onMouseMove={e => moveDrag(e)}
                onMouseUp={endDrag}
              >
                <button type="button">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_436_9919)">
                      <path
                        d="M11 18C11 19.1 10.1 20 9 20C7.9 20 7 19.1 7 18C7 16.9 7.9 16 9 16C10.1 16 11 16.9 11 18ZM9 10C7.9 10 7 10.9 7 12C7 13.1 7.9 14 9 14C10.1 14 11 13.1 11 12C11 10.9 10.1 10 9 10ZM9 4C7.9 4 7 4.9 7 6C7 7.1 7.9 8 9 8C10.1 8 11 7.1 11 6C11 4.9 10.1 4 9 4ZM15 8C16.1 8 17 7.1 17 6C17 4.9 16.1 4 15 4C13.9 4 13 4.9 13 6C13 7.1 13.9 8 15 8ZM15 10C13.9 10 13 10.9 13 12C13 13.1 13.9 14 15 14C16.1 14 17 13.1 17 12C17 10.9 16.1 10 15 10ZM15 16C13.9 16 13 16.9 13 18C13 19.1 13.9 20 15 20C16.1 20 17 19.1 17 18C17 16.9 16.1 16 15 16Z"
                        fill="#2C3E50"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_436_9919">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>

                {item.params.nom}
              </motion.div>
            </div>
          ))}

        {/* Validation button */}
        {items && items.length > 0 && (
          <button
            type="button"
            className={`btn btn-sm bg-primary w-full border-none text-txton3 hover:bg-primary font-normal h-10 rounded-md`}
            onClick={handleValidate}
          >
            {loading ? (
              <span className="loading loading-spinner text-txton3"></span>
            ) : (
              "Valider"
            )}
          </button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DragDropWidget;
