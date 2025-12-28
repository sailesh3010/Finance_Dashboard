"use client";

import React, { useState, useEffect } from "react";
import { useWidgetStore } from "@/store/useWidgetStore";
import { Modal } from "@/components/ui/Modal";
import { AddWidgetForm } from "@/components/dashboard/AddWidgetForm";
import { Widget } from "@/components/dashboard/Widget";

// Drag and Drop Imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* ---------------- SORTABLE WRAPPER ---------------- */
function SortableWidget({ widget }: { widget: any }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
    >
      <Widget config={widget} />
    </div>
  );
}

/* ---------------- PAGE ---------------- */
export default function Home() {
  const { widgets, setWidgets } = useWidgetStore();
  const [isModalOpen, setModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ---------------- EXPORT ---------------- */
  const exportConfig = () => {
    const dataStr = JSON.stringify(widgets, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const link = document.createElement("a");
    link.href = dataUri;
    link.download = "finboard-config.json";
    link.click();
  };

  /* ---------------- IMPORT ---------------- */
  const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (Array.isArray(imported)) setWidgets(imported);
        else alert("Invalid config file");
      } catch {
        alert("Failed to import config");
      }
    };
    reader.readAsText(file);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = widgets.findIndex((w) => w.id === active.id);
      const newIndex = widgets.findIndex((w) => w.id === over.id);
      setWidgets(arrayMove(widgets, oldIndex, newIndex));
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#090b0d] text-slate-100 p-8">
      {/* ---------------- HEADER ---------------- */}
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-black text-emerald-500 tracking-tighter italic">
            FINBOARD
          </h1>
          <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-[0.2em] font-bold">
            {widgets.length} ACTIVE MODULES — REAL-TIME MONITORING
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportConfig}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-full text-xs font-bold transition"
          >
            Export
          </button>

          <label className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-full text-xs font-bold cursor-pointer transition">
            Import
            <input
              type="file"
              accept="application/json"
              onChange={importConfig}
              className="hidden"
            />
          </label>

          <button
            onClick={() => setModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-full font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-900/20"
          >
            <span className="text-xl">+</span> Add Widget
          </button>
        </div>
      </header>

      {/* ---------------- MODAL ---------------- */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Configure New Widget"
      >
        <AddWidgetForm onSuccess={() => setModalOpen(false)} />
      </Modal>

      {/* ---------------- DASHBOARD ---------------- */}
      <div className="max-w-7xl mx-auto">
        {widgets.length === 0 ? (
          <div className="border-2 border-dashed border-slate-800 rounded-3xl py-32 text-center bg-[#0d1117]/50">
            <p className="text-slate-500 font-medium italic">
              Dashboard empty. Click “Add Widget” to begin.
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={widgets.map((w) => w.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {widgets.map((widget) => (
                  <SortableWidget key={widget.id} widget={widget} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </main>
  );
}
