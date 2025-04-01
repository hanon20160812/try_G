document.addEventListener("DOMContentLoaded", async function () {
  // 加载sidebar.html内容
  const sidebarResponse = await fetch("sidebar.html");
  const sidebarContent = await sidebarResponse.text();
  document.getElementById("sidebar").innerHTML = sidebarContent;

  // 其他事件监听和逻辑...
});

document.addEventListener("DOMContentLoaded", function () {
  // 监听存档按钮的点击事件
  document.getElementById("saveButton").addEventListener("click", function () {
    const resultElement = document.getElementById("result");
    const code = resultElement.textContent.trim(); // 获取生成的代码并去除空白
    const copyButton = document.getElementById("copyButton");

    // 检查生成的内容是否为空
    if (code === "") {
      alert("請填資料才可以下載噢▼・ᴥ・▼");
      return; // 如果为空，直接返回，不执行后续代码
    }

    // 创建一个 Blob 对象
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    // 创建一个临时链接元素
    const a = document.createElement("a");
    a.href = url;
    a.download = "g_code.txt"; // 指定下载文件名
    document.body.appendChild(a); // 将链接添加到文档
    a.click(); // 触发点击下载
    document.body.removeChild(a); // 下载后移除链接
    URL.revokeObjectURL(url); // 释放对象 URL
  });

  const checkboxes = document.querySelectorAll(
    'input[type="checkbox"][id^="N"]'
  );
  const dynamicFieldsetArea = document.getElementById("dynamicFieldsetArea");
  let selectedPrograms = []; // 儲存選擇的程式

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      handleCheckboxChange(this);
    });
  });

  const toolData = {
    T7: { remark: "6mm mill", spindleSpeed: "2650", feedSpeed: "40" },
    T8: { remark: "12mm mill", spindleSpeed: "1280", feedSpeed: "120" },
    T9: { remark: "6mm drill", spindleSpeed: "3200", feedSpeed: "200" },
    T10: { remark: "13mm drill", spindleSpeed: "1600", feedSpeed: "100" },
    T11: { remark: "22mm drill", spindleSpeed: "3200", feedSpeed: "125" },
    T12: { remark: "26mm drill", spindleSpeed: "3200", feedSpeed: "150" },
  };

  function createFieldset(program) {
    const fieldset = document.createElement("fieldset");
    fieldset.classList.add("dynamic-fieldset");
    fieldset.id = `fieldset-${program}`;
    fieldset.innerHTML = `
      <legend>${program}</legend>
      <div class="form-group">
        <label for="toolT-${program}">刀庫T：</label>
        <select id="toolT-${program}" name="toolT" onchange="updateToolData('${program}')">
          <option value="">請選擇</option>
          <option value="T1">T1</option>
          <option value="T2">T2</option>
          <option value="T3">T3</option>
          <option value="T4">T4</option>
          <option value="T5">T5</option>
          <option value="T7">T7（6mi）</option>

    <optgroup label="T8（12mi）">
      <option value="T8">T8重切削</option>
      <option value="T8">T8輕切削</option>
    </optgroup>

          <option value="T8">T8（12mi）</option>

          <option value="T9">T9（6Dr）</option>
          <option value="T10">T10（13Dr）</option>
          <option value="T11">T11（22Dr）</option>
          <option value="T12">T12（26Dr）</option>
        </select>
      </div>
      <div class="form-group">
        <label for="toolRemark-${program}">刀庫備註：</label>
        <input type="text" id="toolRemark-${program}" name="toolRemark">
      </div>
      <div class="form-group">
        <label for="coordinateXY-${program}">進刀點：</label>
        <input type="text" id="coordinateXY-${program}" name="coordinateXY">
      </div>
      <div class="form-group">
        <label for="coordinates-${program}">刀路結果：</label>
        <textarea id="coordinates-${program}" name="coordinates" rows="3" style="width: 55%;"placeholder=" (X159.9999 Y-48.8390 ( 22 )範例)"></textarea>
      </div>
      <div class="form-group">
        <label for="spindleSpeed-${program}">主軸轉速S：</label>
        <input type="text" id="spindleSpeed-${program}" name="spindleSpeed" placeholder="只要輸入數字即可">
      </div>
      <div class="form-group">
        <label for="correctionH-${program}">補正H：</label>
        <input type="text" id="correctionH-${program}" name="correctionH" value="H1" readonly>
      </div>



<!-- 要隱藏的欄位-->

<div class="form-group" style="display: none;">
<label for="drillUpZ-${program}" style="background-color: #CDC1FF">勿輸入：</label>
<input type="number" id="drillUpZ-${program}" name="drillUpZ" placeholder="只要輸入數字即可" > 
</div>

<div class="form-group" style="display: none;">
<label for="depthZ-${program}" style="background-color: #84C1FF">勿輸入：</label>
<input type="number" id="depthZ-${program}" name="depthZ" placeholder="只要輸入數字即可" min="-150" max="300"  oninput="validateDepthZ(this)">
</div>

<div class="form-group" style="display: none;">
<label for="drillHeightR-${program}">勿輸入：</label>
<input type="number" id="drillHeightR-${program}" name="drillHeightR" placeholder="只要輸入數字即可" > 
</div>


<div class="form-group" style="display: none;">
<label for="feedSpeedF-${program}">勿輸入：</label>
<input type="text" id="feedSpeedF-${program}" name="feedSpeedF" placeholder="只要輸入數字即可">
</div>

<!-- 要隱藏的欄位-->






<div class="form-group">
<label for="endUpZ-${program}" style="background-color: #FFB0B0">結束提刀Z：</label>
<input type="number" id="endUpZ-${program}" name="endUpZ" placeholder="只要輸入數字即可" value="100">
</div>

<div class="form-group">
<label for="isHighest-${program}">是否至最高：</label>
<select id="isHighest-${program}" name="isHighest" > 
  <option value="G91G28Z0">YES</option>
  <option value="" selected>NO</option> 
</select>
</div>

<div class="form-group">
<label for="programEndX">結束位置X：</label>
<input type="text" id="programEndX" name="programEndX" placeholder="輸入程式結束位置X" value="(G0G90X-100)"> 
</div>



    `;
    dynamicFieldsetArea.appendChild(fieldset);
  }

  // 確保 validateDepthZ 函數在全局範圍
  window.validateDepthZ = function (input) {
    const value = parseFloat(input.value);

    // 檢查輸入是否為負數
    if (value >= 300) {
      input.value = "300"; // 如果輸入的值不為負數，則清空輸入
      alert("深度Z的值不能高於300，已自動設置為300");
    }
    // 檢查輸入是否小於 -150
    else if (value < -150) {
      input.value = -150; // 如果輸入的值小於 -150，則設置為 -150
      alert("深度Z的值不能低於-150，已自動設置為-150");
    }
  };

  function adjustFormAreaHeight() {
    const formArea = document.querySelector(".form-area");
    // 重置高度以便准确计算
    formArea.style.height = "auto";
    // 设置为内容的高度
    formArea.style.height = `${formArea.scrollHeight}px`;
  }

  // 监听所有程序选择的变化
  document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener("change", adjustFormAreaHeight);
  });

  // 页面加载时调用一次以确保初始高度正确
  window.onload = adjustFormAreaHeight;

  // 更新刀庫相關欄位的函數
  window.updateToolData = function (program) {
    const selectedTool = document.getElementById(`toolT-${program}`).value;

    if (selectedTool && toolData[selectedTool]) {
      document.getElementById(`toolRemark-${program}`).value =
        toolData[selectedTool].remark;
      document.getElementById(`spindleSpeed-${program}`).value =
        toolData[selectedTool].spindleSpeed;
      document.getElementById(`feedSpeedF-${program}`).value =
        toolData[selectedTool].feedSpeed;
    } else {
      // 清空欄位
      document.getElementById(`toolRemark-${program}`).value = "";
      document.getElementById(`spindleSpeed-${program}`).value = "";
      document.getElementById(`feedSpeedF-${program}`).value = "";
    }

    // 補正H欄位的更新
    const correctionInput = document.getElementById(`correctionH-${program}`);
    const toolIndex = selectedTool
      ? parseInt(selectedTool.replace("T", ""), 10)
      : 1; // 默認為 H1
    correctionInput.value = `H${toolIndex}`;
  };

  // 生成CODE函數
  function generateCode() {
    const model = document.getElementById("model").value;
    const length = document.getElementById("length").value;
    const coordinateG = document.getElementById("coordinateG").value;
    const origin = document.getElementById("origin").value;
    const programEndX = document.getElementById("programEndX").value;

    // 将刀具信息初始化为空字符串，稍后根据每个程序进行填充
    let toolInfo = "";

    let code = `(${model})\n(L=${length})\n(!!!!!!${coordinateG}!!!!!!)\n${origin}\n`;

    const dynamicFieldsets = document.querySelectorAll(".dynamic-fieldset");

    dynamicFieldsets.forEach((fieldset) => {
      const program = fieldset.querySelector("legend").textContent;
      const toolT = fieldset.querySelector(`select[name="toolT"]`).value;
      const coordinateXY = fieldset.querySelector(
        `input[name="coordinateXY"]`
      ).value;
      const coordinates = fieldset.querySelector(
        `textarea[name="coordinates"]`
      ).value; // 获取座标们的内容
      const spindleSpeed = fieldset.querySelector(
        `input[name="spindleSpeed"]`
      ).value;
      const correctionH = fieldset.querySelector(
        `input[name="correctionH"]`
      ).value;
      const feedSpeedF = fieldset.querySelector(
        `input[name="feedSpeedF"]`
      ).value;
      const toolRemark = fieldset.querySelector(
        `input[name="toolRemark"]`
      ).value; // 获取刀库备注
      const depthZ = fieldset.querySelector(`input[name="depthZ"]`).value; // 获取深度Z
      const drillUpZ = document.getElementById(`drillUpZ-${program}`).value;
      const drillHeightR = document.getElementById(
        `drillHeightR-${program}`
      ).value;
      const endUpZ = document.getElementById(`endUpZ-${program}`).value;
      const isHighest = document.getElementById(`isHighest-${program}`).value; // 獲取 "是否至最高：" 的值
      const origin = document.getElementById("origin").value;

      // 对每个选中的程序追加相应的刀库信息
      toolInfo += `(${toolRemark}, ${toolT} ${correctionH} S${spindleSpeed} F${feedSpeedF})\n`;
      code += `
(${toolRemark},<span class="highlight-yellow"> ${toolT} ${correctionH}</span> S${spindleSpeed} F${feedSpeedF})

${program}
<span class="highlight-yellow">${toolT}</span>(${toolRemark})
G0G90<span class="highlight-green">${coordinateG}</span><span class="coordinate-box">${coordinateXY}</span>(!!) M3S${spindleSpeed}
G43<span class="highlight-yellow">${correctionH}</span>Z70.
M8
M1
G0G90Z30.(安全降刀)
M1
G0G90Z10.(安全降刀)
M1


(!!) 
${coordinates} 

G0G90<span style="background-color: #FFB0B0">Z${endUpZ}.</span>M9
M5
${isHighest}

    
`;
    });

    // 将刀具信息添加到生成的代码开头
    code = `${toolInfo}\n${code}`;

    // 最后追加结尾程式碼
    code += `
(~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~)
${programEndX}
M30
        `;

    // 将生成的程式码显示到结果区域

    const resultElement = document.getElementById("result");
    resultElement.innerHTML = code;

    // 调整结果框的高度
    resultElement.style.height = "auto"; // 先设为自动以便计算高度
    const height = resultElement.scrollHeight; // 获取内容高度
    resultElement.style.height = `${height}px`; // 设定高度
  }

  // 監聽生成按鈕的點擊事件
  document
    .getElementById("generateButton")
    .addEventListener("click", generateCode);

  const generateButton = document.getElementById("generateButton");

  if (generateButton) {
    generateButton.addEventListener("click", scrollToTop);
  } else {
    // 處理元素不存在的情況，例如顯示錯誤訊息
    console.error("Generate button not found.");
  }

  function scrollToTop() {
    // 頁面往上滑動
    if ("scrollBehavior" in document.documentElement.style) {
      window.scrollTo({
        top: 0, // 滑動到頁面頂部
        behavior: "smooth", // 平滑滾動
      });
    } else {
      // 舊版瀏覽器的相容方案，例如：
      window.scrollTo(0, 0);
    }
  }

  // 監聽複製按鈕的點擊事件
  copyButton.addEventListener("click", copyToClipboard);

  function copyToClipboard() {
    const resultDiv = document.getElementById("result");
    const textToCopy = resultDiv.innerText; // 或 resultDiv.textContent

    // 使用 Clipboard API 進行複製
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        // 複製成功
        console.log("Text copied to clipboard");
      })
      .catch((err) => {
        // 複製失敗
        console.error("Failed to copy: ", err);
      });
  }

  // 保留每次新增選項後，原有欄位內容保留

  /**
   * 處理複選框狀態變化，管理選中的程式列表，並觸發更新欄位組的功能。
   * @param {HTMLInputElement} checkbox - 當前被點擊的複選框元素。
   */
  function handleCheckboxChange(checkbox) {
    const value = checkbox.value; // 獲取複選框的值 (程式編號)

    if (checkbox.checked) {
      // 如果複選框被選中
      if (!selectedPrograms.includes(value)) {
        // 如果程式編號未被選中
        selectedPrograms.push(value); // 添加到選中程式列表
        selectedPrograms.sort((a, b) => {
          // 對程式編號排序 (可移除)
          const numA = parseInt(a.replace(/\D/g, ""));
          const numB = parseInt(b.replace(/\D/g, ""));
          if (isNaN(numA) && isNaN(numB)) {
            return a.localeCompare(b);
          } else if (isNaN(numA)) {
            return 1;
          } else if (isNaN(numB)) {
            return -1;
          } else {
            return numA - numB;
          }
        });
      }
    } else {
      // 如果複選框未被選中
      selectedPrograms = selectedPrograms.filter(
        (program) => program !== value
      ); // 從選中程式列表中移除
    }

    try {
      updateFieldsets(); // 更新欄位組
    } catch (error) {
      console.error("更新欄位組時發生錯誤：", error); // 錯誤處理
    }
  }

  function updateFieldsets() {
    // 儲存現有欄位值
    const existingValues = {};
    selectedPrograms.forEach((program) => {
      const fieldset = createFieldset(program); // 创建新的 fieldset
      const remarkField = document.getElementById(`toolRemark-${program}`);
      const spindleSpeedField = document.getElementById(
        `spindleSpeed-${program}`
      );
      const feedSpeedField = document.getElementById(`feedSpeedF-${program}`);
      const toolField = document.getElementById(`toolT-${program}`); // 获取刀庫T的字段
      const toolpositionField = document.getElementById(
        `toolPosition-${program}`
      );
      const rapidmoveRField = document.getElementById(`rapidMoveR-${program}`);
      const ishighestField = document.getElementById(`isHighest-${program}`);
      // 保存现有字段的值
      if (remarkField)
        existingValues[`toolRemark-${program}`] = remarkField.value;
      if (spindleSpeedField)
        existingValues[`spindleSpeed-${program}`] = spindleSpeedField.value;
      if (feedSpeedField)
        existingValues[`feedSpeedF-${program}`] = feedSpeedField.value;
      if (toolField) existingValues[`toolT-${program}`] = toolField.value; // 保留刀庫T的值
      if (toolpositionField)
        existingValues[`toolPosition-${program}`] = toolpositionField.value; // 使用 toolpositionField
      if (rapidmoveRField)
        existingValues[`rapidMoveR-${program}`] = rapidmoveRField.value; // 使用 rapidmoveRField
      if (ishighestField)
        existingValues[`isHighest-${program}`] = ishighestField.value; // 使用 ishighestField
    });

    // 重新创建 fieldsets 并填入值
    dynamicFieldsetArea.innerHTML = ""; // 清空現有欄位組 (僅執行一次)
    selectedPrograms.forEach((program) => {
      createFieldset(program); // 建立新的欄位組

      // 獲取欄位元素並填入值

      const remarkField = document.getElementById(`toolRemark-${program}`);
      const spindleSpeedField = document.getElementById(
        `spindleSpeed-${program}`
      );
      const feedSpeedField = document.getElementById(`feedSpeedF-${program}`);
      const toolField = document.getElementById(`toolT-${program}`); // 获取刀庫T的字段
      const toolPositionField = document.getElementById(
        `toolPosition-${program}`
      );
      const rapidMoveRField = document.getElementById(`rapidMoveR-${program}`);
      const isHighestField = document.getElementById(`isHighest-${program}`);

      if (remarkField)
        remarkField.value = existingValues[`toolRemark-${program}`] || "";
      if (spindleSpeedField)
        spindleSpeedField.value =
          existingValues[`spindleSpeed-${program}`] || "";
      if (feedSpeedField)
        feedSpeedField.value = existingValues[`feedSpeedF-${program}`] || "";
      if (toolField) toolField.value = existingValues[`toolT-${program}`] || ""; // 填入刀庫T的值
      if (toolPositionField)
        toolPositionField.value =
          existingValues[`toolPosition-${program}`] || "";
      if (rapidMoveRField)
        rapidMoveRField.value = existingValues[`rapidMoveR-${program}`] || "";
      if (isHighestField)
        isHighestField.value = existingValues[`isHighest-${program}`] || "";
    });
  }
});
