import { Button } from "./ui/button";

type Props = {
  leftButtonDisabled: boolean;
  rightButtonDisabled: boolean;
  goLeft: () => void;
  goRight: () => void;
};

export function Pagination({
  leftButtonDisabled,
  rightButtonDisabled,
  goLeft,
  goRight,
}: Props) {
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <div className="space-x-2">
        <Button
          variant="noShadow"
          size="sm"
          onClick={goLeft}
          disabled={leftButtonDisabled}
        >
          Previous
        </Button>
        <Button
          variant="noShadow"
          size="sm"
          onClick={goRight}
          disabled={rightButtonDisabled}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
