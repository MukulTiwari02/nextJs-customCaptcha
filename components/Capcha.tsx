import { useState, useEffect } from "react";

export default function Captcha({ captchaKey, onChange }) {
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  useEffect(() => {
    onChange(selectedIndexes);
  }, [selectedIndexes]);
  useEffect(() => {
    setSelectedIndexes([]);
  }, [captchaKey]);

  function toggleIndex(index: any) {
    setSelectedIndexes((prev) => {
      if (prev.includes(index)) {
        return prev.filter((v) => v !== index);
      } else {
        return [...prev, index];
      }
    });
  }

  const imageLocations = new Array(9).fill(null).map((value, index) => {
    return `/api/captcha-image?index=${index}&key=${captchaKey}`;
  });

  return (
    <div>
      <h2 className="font-bold text-2xl">Select all Dogs :</h2>
      <div className="mt-4 h-[300px] w-[300px] grid grid-cols-3 gap-2 items-center">
        {imageLocations.map((imageUrl, index) => (
          <div
            onClick={() => toggleIndex(index)}
            className={
              selectedIndexes.includes(index)
                ? "border-4 border-green-500 opacity-80 "
                : "" + " bg-white object-cover"
            }
          >
            <img className="object-cover" src={imageUrl} alt="" />
          </div>
        ))}
      </div>
    </div>
  );
}
