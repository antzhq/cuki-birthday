"use client";

interface NavBarProps {
  title: string;
  onBack?: () => void;
  backLabel?: string;
  right?: React.ReactNode;
}

export function NavBar({ title, onBack, backLabel = "← Volver", right }: NavBarProps) {
  return (
    <div className="flex items-center justify-between w-full mb-4 min-h-[44px]">
      {onBack ? (
        <button
          className="text-sm text-cookie-dark/50 active:text-cookie-dark min-w-[44px] min-h-[44px] flex items-center"
          onClick={onBack}
        >
          {backLabel}
        </button>
      ) : (
        <div className="min-w-[44px]" />
      )}

      <h2 className="text-lg font-bold text-cookie-dark text-center flex-1 px-2 truncate">
        {title}
      </h2>

      {right ? (
        <div className="min-w-[44px] flex items-center justify-end">{right}</div>
      ) : (
        <div className="min-w-[44px]" />
      )}
    </div>
  );
}
