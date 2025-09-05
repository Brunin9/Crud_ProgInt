// Middleware para log de requisições
const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
};

// Middleware de validação de dados do aluno
const validateAluno = (req, res, next) => {
    const { nome, cpf, telefone, email, matricula, escola } = req.body;
    
    const errors = [];
    
    // Validações obrigatórias
    if (!nome || nome.trim().length < 2) {
        errors.push('Nome deve ter pelo menos 2 caracteres');
    }
    
    if (!cpf || !isValidCPF(cpf)) {
        errors.push('CPF deve ter 11 dígitos e ser válido');
    }
    
    if (!telefone || telefone.length < 10) {
        errors.push('Telefone deve ter pelo menos 10 dígitos');
    }
    
    if (!email || !isValidEmail(email)) {
        errors.push('Email deve ter um formato válido');
    }
    
    if (!matricula || matricula.trim().length < 3) {
        errors.push('Matrícula deve ter pelo menos 3 caracteres');
    }
    
    if (!escola || escola.trim().length < 2) {
        errors.push('Escola deve ter pelo menos 2 caracteres');
    }
    
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Dados inválidos',
            errors: errors
        });
    }
    
    next();
};

// Middleware de tratamento de erros
const errorHandler = (err, req, res, next) => {
    console.error('Erro:', err.message);
    
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? err.stack : {}
    });
};

// Função auxiliar para validar CPF
function isValidCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    
    let remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;
    
    return true;
}

// Função auxiliar para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

module.exports = {
    requestLogger,
    validateAluno,
    errorHandler
};