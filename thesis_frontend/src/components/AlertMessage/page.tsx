import clsx from 'clsx';

interface AlertMessageProps {
  type: 'success' | 'error'; // Définissez les types possibles pour 'type'
  message: string; // 'message' est une chaîne de caractères
}

const AlertMessage: React.FC<AlertMessageProps> = ({ type, message }) => {
  return (
    <div
      className={clsx(
        'px-4 py-3 rounded relative',
        {
          'bg-green-100 border-green-600 text-dark': type === 'success',
          '  bg-red	border-dark text-white': type === 'error',
        },
        'mb-3'
      )}
      role="alert"
    >
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

export default AlertMessage;
