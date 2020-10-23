import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import produce from 'immer';

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

  useEffect(() => {
    const difference = Array.from(selected).filter(item => !listItems.includes(item));
    if (difference.length > 0) {
      setSelected(
        produce(currentSelected => {
          difference.forEach(diff => currentSelected.delete(diff));
        })
      );
    }
  }, [listItems, selected]);

  const handleSelectAllClick = useCallback(
    event => {
      if (event.target.checked) {
        setSelected(new Set(listItems));
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
        ? setSelected(
            produce(currentSelected => {
              currentSelected.add(id);
            })
          )
        : setSelected(
            produce(currentSelected => {
              currentSelected.delete(id);
            })
          );
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
