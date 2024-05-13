// 성공 모달
export async function successModal(text) {
  const result = Swal.fire({
    title: text,
    icon: 'success',
    // confirmButtonColor: '#4fd1c5',
    // confirmButtonText: '로그인',
    showConfirmButton: false
  })

  console.log(result);
}

// 실패 모달
export async function infoModal(text) {
  const result = Swal.fire({
    title: text,
    icon: 'info',
    // confirmButtonColor: '#4fd1c5',
    // confirmButtonText: '로그인',
    showConfirmButton: false
  })

  console.log(result);
}