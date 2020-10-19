import { ChangeEvent, useCallback, useMemo, useState } from 'react';

export interface ListCheckboxReturn {
  indeterminate: boolean;
  checked: boolean;
  handleSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
  itemSelected: (item: string) => boolean;
  handleSelectClick: (item: string) => (event: ChangeEvent<HTMLInputElement>) => void;
  selected: Set<string>;
  setSelected: (selection: Set<string>) => void;
  numSelected: number;
}

const useListCheckbox = (listItems: Array<string>): ListCheckboxReturn => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const numSelected = useMemo(() => selected.size, [selected.size]);
  const rowCount = useMemo(() => listItems.length, [listItems.length]);
  const indeterminate = useMemo(() => numSelected > 0 && numSelected < rowCount, [
    numSelected,
    rowCount
  ]);
  const checked = useMemo(() => rowCount > 0 && numSelected === rowCount, [numSelected, rowCount]);
  const handleSelectAllClick = useCallback(
    event => {
      if (event.target.checked) {
        const newSelected = new Set(listItems);
        setSelected(newSelected);
      } else setSelected(new Set());
    },
    [listItems]
  );
  const itemSelected = useCallback(
    item => {
      return selected.has(item);
    },
    [selected]
  );
  const handleSelectClick = useCallback((id: string) => {
    return (event: ChangeEvent<HTMLInputElement>): void => {
      event.target.checked
        ? setSelected(currentSelected => {
            currentSelected.add(id);
            return new Set(currentSelected);
          })
        : setSelected(currentSelected => {
            currentSelected.delete(id);
            return new Set(currentSelected);
          });
    };
  }, []);

  return {
    indeterminate,
    checked,
    handleSelectAllClick,
    itemSelected,
    handleSelectClick,
    selected,
    setSelected,
    numSelected
  };
};

export default useListCheckbox;
