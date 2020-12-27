export const shaderUtils = {
    createProgramFromScripts: function (gl, shaderScriptIds) {
        const shaders = [];
        for (let i = 0; i < shaderScriptIds.length; ++i) {
            shaders.push(
                shaderUtils.createShaderFromScript(gl, shaderScriptIds[i])
            );
        }

        return shaderUtils.createProgram(gl, shaders);
    },

    createShaderFromScript: function (gl, scriptId) {
        let shaderSource = '';
        let shaderType;
        const shaderScript = document.getElementById(scriptId);
        shaderSource = shaderScript.text;

        if (shaderScript.type === 'x-shader/x-vertex') {
            shaderType = gl.VERTEX_SHADER;
        } else if (shaderScript.type === 'x-shader/x-fragment') {
            shaderType = gl.FRAGMENT_SHADER;
        } else {
            throw ('*** Error: unknown shader type');
        }

        return shaderUtils.loadShader(
            gl, shaderSource, shaderType
        );
    },

    loadShader: function (gl, shaderSource, shaderType) {
        const shader = gl.createShader(shaderType);
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);

        const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
            const lastError = gl.getShaderInfoLog(shader);
            console.error('*** Error compiling shader \'' + shader + '\':' + lastError + `\n` + shaderSource.split('\n').map((l, i) => `${i + 1}: ${l}`).join('\n'));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    },

    createProgram: function (gl, shaders) {
        const program = gl.createProgram();
        shaders.forEach(function (shader) {
            gl.attachShader(program, shader);
        });

        gl.linkProgram(program);

        const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!linked) {
            const lastError = gl.getProgramInfoLog(program);
            console.error('Error in program linking:' + lastError);

            gl.deleteProgram(program);
            return null;
        }
        return program;
    }
};

