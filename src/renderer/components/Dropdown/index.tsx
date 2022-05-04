import { FC, useEffect, useRef, useState } from 'react';
import '@renderer/components/Dropdown/index.scss';
import icon from '@renderer/assets/icons/arrow.png';

interface IDropdown {
  data: { text: string }[];
  value: number;
  width?: number;
  onChange: (index: number) => void;
}

const Dropdown: FC<IDropdown> = ({ data, value, onChange, width }) => {
  const [open, setOpen] = useState(false);
  const [state, setstate] = useState(value);

  const a = useRef(null);

  window.addEventListener('click', (e) => {
    // @ts-ignore
    if (a.current && !a.current.contains(e.target)) {
      setOpen(false);
    }
  });

  const handleOpen = () => {
    setOpen(!open);

    if (!open) {
      let d = a.current as any as HTMLDivElement;
      let b = d.querySelectorAll('.dropdown-item.active')[0] as HTMLButtonElement;
      b?.scrollIntoView();
    }
  };

  const handleSelect = (index: number) => {
    setOpen(!open);
    setstate(index);
    if (onChange) onChange(index);
  };

  const meh = (ev: KeyboardEvent) => {
    if (ev.code === 'Space' || ev.code === 'Enter') {
      // @ts-ignore
      if (a.current && a.current.contains(ev.target)) {
        handleOpen();
      }
    }

    // if (ev.code === 'ArrowDown' && open) {
    //   setstate((s) => {
    //     let n = s + 1;
    //     if (s + 1 > data.length) {
    //       s = 0;
    //     }
    //     return n;
    //   });
    // }

    // if (ev.code === 'ArrowUp' && open) {
    //   setstate((s) => {
    //     let n = s - 1;
    //     if (n < 0) {
    //       n = data.length - 1;
    //     }
    //     return n;
    //   });
    // }
  };

  useEffect(() => {
    window.addEventListener('keyup', meh);
    return () => {
      window.removeEventListener('keyup', meh);
    };
  }, [a]);

  // window.addEventListener('keyup', (ev) => {
  //   if (open) {
  //     if (ev.code === 'ArrowDown') {
  //       let index = state + 1;
  //       if (index < 0) {
  //         index = data.length - 1;
  //       } else if (index > data.length - 1) {
  //         index = 0;
  //       }

  //       setstate(() => {
  //         if (onChange) onChange(index);
  //         return index;
  //       });
  //     } else if (ev.code === 'ArrowUp') {
  //       let index = state - 1;
  //       if (index < 0) {
  //         index = data.length - 1;
  //       } else if (index > data.length - 1) {
  //         index = 0;
  //       }
  //       setstate(() => {
  //         if (onChange) onChange(index);
  //         return index;
  //       });
  //     }
  //   }
  // });

  return (
    <div ref={a} tabIndex={0} className={'dropdown' + (open ? ' open' : '')} style={width !== undefined ? { width: width + 'px' } : {}}>
      <p onClick={handleOpen} className="item-dflt">
        {data[state]?.text}
      </p>
      <img src={icon} className="arrow" />
      <div className="dropdown-cont">
        {data.map((l, i) => {
          return (
            <div key={i} onClick={() => handleSelect(i)} className={'dropdown-item' + (state === i ? ' active' : '')}>
              {l.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dropdown;
