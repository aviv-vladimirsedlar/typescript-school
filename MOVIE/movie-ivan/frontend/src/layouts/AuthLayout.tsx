import React, { ReactNode } from 'react';

export const AuthLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="rounded-10 container mx-auto flex h-screen flex-col items-center justify-center pb-20">
      <div className="flex w-1/2 flex-col items-center justify-center rounded-xl p-8 shadow-2xl lg:p-20">
        <div className="mb-20 h-auto w-64">
          <svg viewBox="0 0 140 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M13.8087 5.14072V17.4484H10.5441L10.1689 16.5854C9.15574 17.4109 7.87993 17.8612 6.45404 17.8612C2.70169 17.8612 0 15.122 0 11.2946C0 7.46718 2.70169 4.76549 6.45404 4.76549C7.91746 4.76549 9.19326 5.25329 10.2064 6.07881L10.6567 5.14072H13.8087ZM9.79363 11.2946C9.79363 9.68106 8.63041 8.48031 7.05442 8.48031C5.44091 8.48031 4.3152 9.68106 4.3152 11.2946C4.3152 12.9081 5.47843 14.1088 7.05442 14.1088C8.63041 14.1088 9.79363 12.9081 9.79363 11.2946ZM28.9681 5.14072L24.015 17.486H20.1876L15.1595 5.14072H19.8124L22.1389 12.4203L24.4278 5.14072H28.9681ZM30.319 5.14072H34.5591V17.4484H30.319V5.14072ZM30.3565 0H34.5216V3.60226H30.3565V0ZM49.7186 5.14072L44.7655 17.4484H40.9381L35.91 5.14072H40.5629L42.8894 12.4203L45.1783 5.14072H49.7186ZM68.3303 5.14072V16.0976C68.3303 19.9625 65.7787 22.364 61.7262 22.364C58.2365 22.364 55.7975 20.6004 55.2346 17.6736H59.3247C59.6248 18.4991 60.6755 18.9494 61.6886 18.9494C63.1145 18.9494 64.2402 18.0488 64.2402 16.5854V16.2102C63.3022 16.8105 62.214 17.1482 61.0132 17.1482C57.486 17.1482 54.8594 14.5216 54.8594 10.9569C54.8594 7.42965 57.486 4.76549 61.0132 4.76549C62.5142 4.76549 63.865 5.29081 64.8781 6.19138L65.4035 5.14072H68.3303ZM61.7637 13.6586C63.3022 13.6586 64.3903 12.5329 64.3903 10.9569C64.3903 9.4184 63.3022 8.25517 61.7637 8.25517C60.2252 8.25517 59.137 9.38088 59.137 10.9569C59.137 12.5329 60.2252 13.6586 61.7637 13.6586ZM79.0245 5.1032V8.96812H77.3735C75.8725 8.96812 75.2346 9.64354 75.2346 11.182V17.4484H70.9945V5.14072H73.8463L74.5217 6.49157C75.3847 5.47843 76.4354 5.06567 77.8988 5.06567H79.0245V5.1032ZM79.7374 11.2946C79.7374 7.46718 82.6267 4.72796 86.6418 4.72796C90.6568 4.72796 93.5461 7.46718 93.5461 11.2946C93.5461 15.0844 90.6568 17.8612 86.6418 17.8612C82.6267 17.8612 79.7374 15.122 79.7374 11.2946ZM86.6418 14.0713C88.1802 14.0713 89.3059 12.9456 89.3059 11.3321C89.3059 9.71859 88.1802 8.59288 86.6418 8.59288C85.1033 8.59288 83.9776 9.71859 83.9776 11.3321C83.9776 12.9456 85.0658 14.0713 86.6418 14.0713ZM95.3472 12.1951V5.14072H99.5874V11.97C99.5874 13.2833 100.3 14.0338 101.426 14.0338C102.552 14.0338 103.227 13.2458 103.227 11.97V5.14072H107.467V12.1951C107.467 15.6473 105.028 17.8987 101.426 17.8987C97.7863 17.8612 95.3472 15.6473 95.3472 12.1951ZM123.64 11.2946C123.64 15.122 120.938 17.8612 117.186 17.8612C116.06 17.8612 115.047 17.561 114.184 17.0357V21.8762H109.981V5.14072H112.871L113.396 6.11633C114.409 5.25329 115.722 4.72796 117.186 4.72796C120.938 4.76548 123.64 7.46718 123.64 11.2946ZM119.362 11.2946C119.362 9.68106 118.199 8.48031 116.623 8.48031C115.047 8.48031 113.884 9.68106 113.884 11.2946C113.884 12.9081 115.047 14.1088 116.623 14.1088C118.162 14.1464 119.362 12.9456 119.362 11.2946Z"
              fill="black"
            ></path>
            <path d="M126.267 14.6717H140V17.636H126.267V14.6717Z" fill="#5009DC"></path>
          </svg>
        </div>
        {children}
      </div>
    </div>
  );
};
