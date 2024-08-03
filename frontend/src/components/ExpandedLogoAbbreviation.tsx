const ExpandedLogoAbbreviation: React.FC = () => {
    let largeInitial = "text-6xl"

    return (
        <div className="w-fit relative space-y-6 text-3xl tracking-widest" style={{ letterSpacing: "4px", whiteSpace: "nowrap" }}>
            <p><span className={largeInitial}>O</span>NLINE</p>
            <p><span className={largeInitial}>B</span>OARD FOR</p>
            <p><span className={largeInitial}>E</span>FFECTIVE</p>
            <p><span className={largeInitial}>L</span>EARNING,</p>
            <p><span className={largeInitial}>I</span>NTERACTION AND</p>
            <p><span className={largeInitial}>S</span>HARING</p>
            <p><span className={largeInitial}>K</span>NOWLEDGE</p>
        </div>
    );
}

export default ExpandedLogoAbbreviation;