const requestLogger = (req, res, next) => {
    //cria timestamp com data e hora atual
    const timestamp = new Date().toISOString();
    
    //Log formatado: [2024-01-15T10:30:45.123Z] GET /api/alunos
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    
    // next() passa para o próximo middleware/rota
    next();
};

//validar aluno
const validateAluno = (req, res, next) => {

    const { nome, cpf, telefone, email, matricula, escola } = req.body;
    
    //array para acumular mensagens de erro
    const errors = [];
    
    //validação do nome (mínimo 2 caracteres, sem espaços vazios)
    if (!nome || nome.trim().length < 2) {
        errors.push('Nome deve ter pelo menos 2 caracteres');
    }
    
    //validação do CPF (deve ter 11 dígitos e ser válido)
    if (!cpf || !isValidCPF(cpf)) {
        errors.push('CPF deve ter 11 dígitos e ser válido');
    }
    
    //validação do telefone (mínimo 10 dígitos)
    if (!telefone || telefone.length < 10) {
        errors.push('Telefone deve ter pelo menos 10 dígitos');
    }
    
    //validação do email (formato válido)
    if (!email || !isValidEmail(email)) {
        errors.push('Email deve ter um formato válido');
    }
    
    //validação da matrícula (mínimo 3 caracteres)
    if (!matricula || matricula.trim().length < 3) {
        errors.push('Matrícula deve ter pelo menos 3 caracteres');
    }
    
    //validação da escola (mínimo 2 caracteres)
    if (!escola || escola.trim().length < 2) {
        errors.push('Escola deve ter pelo menos 2 caracteres');
    }
    
    //se tem erro retorna status 400 (Bad Request) com lista de erros
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Dados inválidos',
            errors: errors
        });
    }
    
    //se tudo válido passa para o próximo middleware/rota
    next();
};

//tratamento de erro
const errorHandler = (err, req, res, next) => {
    //log do erro no console para debugging
    console.error('Erro:', err.message);
    
    // Resposta padronizada de erro
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? err.stack : {}
    });
};

//validação de CPF
/**
 * Valida se um CPF é válido usando o algoritmo oficial
 * @param {string} cpf - CPF a ser validado
 * @returns {boolean} - true se válido, false se inválido
 */
function isValidCPF(cpf) {
    //remove caracteres não numéricos (pontos, hífens, espaços)
    cpf = cpf.replace(/[^\d]/g, '');
    
    //verifica se tem 11 dígitos
    if (cpf.length !== 11) return false;
    
    // Verifica se não são todos os dígitos iguais (111.111.111-11, etc.)
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    //validação de CPF
    //calcula primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    
    let remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;
    
    //calcula segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;
    
    return true;
}
//validação de email
/**
 * Valida formato de email usando expressão regular
 * @param {string} email - Email a ser validado
 * @returns {boolean} - true se formato válido
 */
function isValidEmail(email) {
    //regex que verifica padrão básico: usuario@dominio.com
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
//exporta todas as funções para serem utilizadas em outros arquivos
module.exports = {
    requestLogger,
    validateAluno,
    errorHandler
};