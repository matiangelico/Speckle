import { styled } from "styled-components";
import { useDropzone } from "react-dropzone";

const StyledFileDropArea = styled.div`
  display: flex;
  height: 30.625rem;
  padding: 1.5rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  align-self: stretch;

  border-radius: 0.25rem;
  border: 1px dashed #b0b0b0;
  background: var(--Shades-White, #fff);

  &:hover {
    background-color: #f5f5f5;
  }

  &:active {
    background-color: #e0e0e0;
  }
`;

const DropzoneContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .select-button {
    margin-top: 10px;
    padding: 8px 16px;
    font-size: 14px;
    color: #333;
    border: 1px solid #333;
    border-radius: 4px;
    background-color: white;
    cursor: pointer;
  }
`

const FileDropArea = () => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles);
    },
  });

  return (
    <StyledFileDropArea {...getRootProps()}>
      <input {...getInputProps()} />
      <DropzoneContent >
        <svg
          width='20'
          height='20'
          viewBox='0 0 20 20'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <g id='Frame' clipPath='url(#clip0_116_7739)'>
            <g id='Group'>
              <g id='Group_2'>
                <path
                  id='Vector'
                  d='M11.6666 1.66669H4.99992C4.08325 1.66669 3.34159 2.41669 3.34159 3.33335L3.33325 16.6667C3.33325 17.5834 4.07492 18.3334 4.99159 18.3334H14.9999C15.9166 18.3334 16.6666 17.5834 16.6666 16.6667V6.66669L11.6666 1.66669ZM14.9999 16.6667H4.99992V3.33335H10.8333V7.50002H14.9999V16.6667ZM6.66659 12.5084L7.84159 13.6834L9.16658 12.3667V15.8334H10.8333V12.3667L12.1583 13.6917L13.3333 12.5084L10.0083 9.16669L6.66659 12.5084Z'
                  fill='#1B1C1E'
                />
              </g>
            </g>
          </g>
          <defs>
            <clipPath id='clip0_116_7739'>
              <rect width='20' height='20' fill='white' />
            </clipPath>
          </defs>
        </svg>
        <p>
          Explora y elige los archivos que deseas cargar desde tu computadora
        </p>
        <button className='select-button'>Seleccionar archivo</button>
      </DropzoneContent>
    </StyledFileDropArea>
  );
};

export default FileDropArea;
