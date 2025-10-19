interface DividerProps {
    mt?: string,
    mb?: string,
}

export default function Divider({mt, mb} : DividerProps){
    return (
        <div className={`
            w-full h-[2px]
            bg-[linear-gradient(135deg,#320E3B_40%,#FF0035_100%)]
            mt-${mt} mb-${mb}
          `}></div>
    );
}