/* ============================================
   CHARACTER ART — Full-body cartoon characters
   Felipe (the explorer kid) and Guía (the guide)
   ============================================ */

const CharacterArt = {
    // ---- FELIPE: full-body cartoon kid ----
    // x, y = center of feet; scale = render scale
    drawFelipe(ctx, x, y, scale = 1, t = 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);

        const bob = Math.sin(t * 2.2) * 3;

        // Shadow
        ctx.fillStyle = 'rgba(5, 8, 32, 0.35)';
        ctx.beginPath();
        ctx.ellipse(0, 2, 46, 9, 0, 0, Math.PI * 2);
        ctx.fill();

        // Legs + shoes
        ctx.strokeStyle = '#2a2a4a';
        ctx.lineWidth = 13;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-16, -52);
        ctx.lineTo(-18, -12 + bob * 0.3);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(16, -52);
        ctx.lineTo(18, -12 - bob * 0.3);
        ctx.stroke();

        // Shoes
        ctx.fillStyle = '#4a7cff';
        this._roundRect(ctx, -32, -14 + bob * 0.3, 30, 14, 6);
        ctx.fill();
        this._roundRect(ctx, 2, -14 - bob * 0.3, 30, 14, 6);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.ellipse(-22, -8 + bob * 0.3, 5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(12, -8 - bob * 0.3, 5, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Torso / shirt
        const grad = ctx.createLinearGradient(-26, -110, 26, -50);
        grad.addColorStop(0, '#ff9f43');
        grad.addColorStop(1, '#ff6b35');
        ctx.fillStyle = grad;
        this._roundRect(ctx, -25, -108, 50, 58, 12);
        ctx.fill();

        // Shirt collar detail
        ctx.fillStyle = '#ffd8a8';
        ctx.beginPath();
        ctx.moveTo(-10, -108);
        ctx.lineTo(0, -94);
        ctx.lineTo(10, -108);
        ctx.closePath();
        ctx.fill();

        // Banda text "19" on shirt
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 18px "Fredoka One", cursive';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('19', 0, -86);

        // Arms
        ctx.strokeStyle = '#ffb3a0';
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';
        const armLift = Math.sin(t * 2.2) * 6;
        ctx.beginPath();
        ctx.moveTo(-24, -100);
        ctx.lineTo(-42, -82 + armLift);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(24, -100);
        ctx.lineTo(42, -86 - armLift);
        ctx.stroke();

        // Hands
        ctx.fillStyle = '#ffc9b3';
        ctx.beginPath();
        ctx.arc(-43, -80 + armLift, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(43, -84 - armLift, 7, 0, Math.PI * 2);
        ctx.fill();

        // Neck
        ctx.fillStyle = '#ffb3a0';
        this._roundRect(ctx, -9, -132, 18, 26, 8);
        ctx.fill();

        // Head
        ctx.fillStyle = '#ffc9b3';
        ctx.beginPath();
        ctx.arc(0, -148, 34, 0, Math.PI * 2);
        ctx.fill();

        // Hair
        ctx.fillStyle = '#3a2d1e';
        ctx.beginPath();
        ctx.arc(0, -154, 34, Math.PI * 1.05, Math.PI * 1.95);
        ctx.closePath();
        ctx.fill();
        // Hair swoop
        ctx.beginPath();
        ctx.moveTo(-30, -156);
        ctx.quadraticCurveTo(0, -192, 28, -158);
        ctx.quadraticCurveTo(30, -140, 24, -144);
        ctx.quadraticCurveTo(10, -170, -22, -146);
        ctx.closePath();
        ctx.fill();

        // Ears
        ctx.fillStyle = '#ffc9b3';
        ctx.beginPath();
        ctx.arc(-33, -144, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(33, -144, 7, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        const blink = (Math.sin(t * 1.1) > 0.94) ? 0.15 : 1;
        ctx.save();
        ctx.scale(1, blink);
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(-13, -152, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(13, -152, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#232029';
        ctx.beginPath();
        ctx.arc(-11, -152, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(15, -152, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(-9, -155, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(17, -155, 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Blush
        ctx.fillStyle = 'rgba(255, 120, 100, 0.35)';
        ctx.beginPath();
        ctx.ellipse(-22, -140, 6, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(22, -140, 6, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Smile
        ctx.strokeStyle = '#8a4a3a';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(0, -138, 10, 0.2, Math.PI - 0.2);
        ctx.stroke();

        // Headband
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(0, -162, 33, Math.PI * 1.1, Math.PI * 1.9);
        ctx.stroke();

        ctx.restore();
    },

    // ---- GUÍA: full-body cartoon alien guide ----
    // x, y = center; scale = render scale
    drawGuide(ctx, x, y, scale = 1, t = 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);

        const bob = Math.sin(t * 2) * 4;
        ctx.translate(0, bob);

        // Glow aura
        ctx.save();
        ctx.shadowColor = '#3366ff';
        ctx.shadowBlur = 30;
        ctx.fillStyle = 'rgba(51, 102, 255, 0.12)';
        ctx.beginPath();
        ctx.arc(0, 0, 62, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Feet (little floating legs)
        ctx.fillStyle = '#6699ff';
        this._roundRect(ctx, -24, 40, 18, 14, 7);
        ctx.fill();
        this._roundRect(ctx, 6, 40, 18, 14, 7);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.beginPath();
        ctx.arc(-15, 46, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(15, 46, 4, 0, Math.PI * 2);
        ctx.fill();

        // Body (egg shape)
        const grad = ctx.createLinearGradient(0, -80, 0, 50);
        grad.addColorStop(0, '#4a8cff');
        grad.addColorStop(0.55, '#2e4fd8');
        grad.addColorStop(1, '#1c2f8f');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, -78);
        ctx.bezierCurveTo(46, -78, 52, 8, 42, 34);
        ctx.quadraticCurveTo(34, 46, 0, 46);
        ctx.quadraticCurveTo(-34, 46, -42, 34);
        ctx.bezierCurveTo(-52, 8, -46, -78, 0, -78);
        ctx.closePath();
        ctx.fill();

        // Belly highlight
        ctx.fillStyle = 'rgba(140, 190, 255, 0.25)';
        ctx.beginPath();
        ctx.ellipse(0, 4, 24, 26, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eyes (big, friendly)
        const blink = (Math.sin(t * 1.3) > 0.96) ? 0.15 : 1;
        ctx.save();
        ctx.scale(1, blink);
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.ellipse(-15, -18, 12, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(15, -18, 12, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1c2a4a';
        ctx.beginPath();
        ctx.arc(-13, -16, 6.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(17, -16, 6.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(-11, -19, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(19, -19, 2.2, 0, Math.PI * 2);
        ctx.fill();
        // Pupil glow tint
        ctx.fillStyle = 'rgba(0, 229, 255, 0.35)';
        ctx.beginPath();
        ctx.arc(-13, -14, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(17, -14, 3, 0, Math.PI * 2);
        ctx.fill();

        // Rosy cheeks
        ctx.fillStyle = 'rgba(255, 120, 180, 0.35)';
        ctx.beginPath();
        ctx.ellipse(-25, -4, 6, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(25, -4, 6, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Smile
        ctx.strokeStyle = '#0f1640';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(0, 2, 11, 0.25, Math.PI - 0.25);
        ctx.stroke();

        // Antenna
        ctx.strokeStyle = '#3366ff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, -76);
        ctx.quadraticCurveTo(4, -104, 0, -112);
        ctx.stroke();
        // Antenna glow orb
        ctx.save();
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 16;
        ctx.fillStyle = '#00e5ff';
        ctx.beginPath();
        ctx.arc(0, -118, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(-2, -120, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Little wings
        ctx.fillStyle = 'rgba(0, 229, 255, 0.5)';
        ctx.beginPath();
        ctx.moveTo(-40, -22);
        ctx.quadraticCurveTo(-62, -38, -58, -46);
        ctx.quadraticCurveTo(-52, -34, -36, -34);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(40, -22);
        ctx.quadraticCurveTo(62, -38, 58, -46);
        ctx.quadraticCurveTo(52, -34, 36, -34);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    },

    _roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }
};