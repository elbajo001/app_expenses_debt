export function validateExpense(data: {
  description: string;
  amount: number;
  paidBy: string;
  participants: string[];
  date: string;
}): string[] {
  const errors: string[] = [];

  if (!data.description?.trim()) {
    errors.push('La descripción es requerida');
  } else if (data.description.length > 100) {
    errors.push('La descripción no puede exceder 100 caracteres');
  }

  if (!data.amount || data.amount <= 0) {
    errors.push('El monto debe ser mayor a 0');
  }

  if (!data.paidBy) {
    errors.push('Debes seleccionar quién pagó');
  }

  if (!data.participants || data.participants.length === 0) {
    errors.push('Debe haber al menos un participante');
  }

  if (!data.date) {
    errors.push('La fecha es requerida');
  }

  return errors;
}

export function validateName(name: string): string[] {
  const errors: string[] = [];

  if (!name?.trim()) {
    errors.push('El nombre es requerido');
  } else if (name.length > 50) {
    errors.push('El nombre no puede exceder 50 caracteres');
  }

  return errors;
}
