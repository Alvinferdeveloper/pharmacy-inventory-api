import { IsString, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'La nueva contraseña debe tener al menos 8 caracteres' })
  @MaxLength(50, { message: 'La nueva contraseña no debe exceder los 50 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,50}$/, {
    message: 'La nueva contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial',
  })
  newPassword!: string;

  @IsString()
  @IsNotEmpty()
  confirmNewPassword!: string;
}
