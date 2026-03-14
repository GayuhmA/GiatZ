import { forwardRef } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { Popover, Transition } from "@headlessui/react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/style.css";

interface CustomDatePickerProps {
  selected?: Date;
  onSelect: (date?: Date) => void;
  placeholder?: string;
  className?: string;
}

const CustomDatePicker = forwardRef<HTMLButtonElement, CustomDatePickerProps>(
  ({ selected, onSelect, placeholder = "Pick a date", className = "" }, ref) => {
    const defaultClassNames = getDefaultClassNames();

    return (
      <Popover className={`relative ${className}`}>
        {({ open }) => (
          <>
            <Popover.Button
              ref={ref}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border focus:outline-none focus:ring-1 focus:ring-primary transition-colors ${
                open ? "border-primary ring-1 ring-primary" : "border-border"
              } bg-white text-sm text-left`}
            >
              <span className={`block truncate ${!selected ? "text-text-secondary" : "text-text-primary font-bold"}`}>
                {selected ? format(selected, "PPP") : placeholder}
              </span>
              <CalendarIcon className="w-5 h-5 text-text-secondary shrink-0" />
            </Popover.Button>

            <Transition
              show={open}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-50 bottom-full mb-2 w-auto min-w-65 rounded-2xl bg-white shadow-card-hover border border-border p-3 left-0">
                <DayPicker
                  mode="single"
                  selected={selected}
                  onSelect={onSelect}
                  showOutsideDays
                  classNames={{
                    root: `${defaultClassNames.root} w-full text-text-primary font-sans text-xs`,
                    chevron: `${defaultClassNames.chevron} fill-primary opacity-70 hover:opacity-100 w-4 h-4`,
                    day: `${defaultClassNames.day} w-8 h-8 rounded-full font-medium hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-primary/50 mx-auto`,
                    today: `font-bold text-primary`,
                    selected: `bg-primary font-bold text-white hover:bg-primary-hover focus:bg-primary-hover hover:text-white`,
                    outside: `text-text-secondary opacity-50`,
                    disabled: `text-gray-300 cursor-not-allowed hidden`,
                  }}
                />
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    );
  }
);

CustomDatePicker.displayName = "CustomDatePicker";
export default CustomDatePicker;
